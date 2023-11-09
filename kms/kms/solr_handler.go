package kms

import (
	"bytes"
	"dependency"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/labstack/echo/v4"
)

func SolrReloadAllIndex(c echo.Context) (err error) {
	err = DeleteAllSolrIndex()
	if err != nil {
		return err
	}
	// fmt.Println("DONE STEP 1")
	ArticleIDs, err := ReadArticleID("WHERE IsActive=1", nil)
	if err != nil {
		return err
	}
	// fmt.Println("DONE STEP 2")
	for _, id := range ArticleIDs {
		Article := Article_Table{ArticleID: id}
		err = Article.Read()
		if err != nil {
			Logger.Error("FAILED TO INDEX ARTICLE WITH ID : " + strconv.Itoa(id) + " WITH TITLE : " + Article.Title + " FAILED IN READING ARTICLE WITH THIS ERROR : " + err.Error())
		}
		// fmt.Println("DONE STEP 3")
		resulta, err := Article.ConvForSolr()
		if err != nil {
			Logger.Error("FAILED TO INDEX ARTICLE WITH ID : " + strconv.Itoa(id) + " WITH TITLE : " + Article.Title + " FAILED IN CONVERTING ARTICLE DATA WITH THIS ERROR : " + err.Error())
		}
		// fmt.Println("DONE STEP 4")
		err = resulta.PrepareSolrData(c)
		if err != nil {
			Logger.Error("FAILED TO INDEX ARTICLE WITH ID : " + strconv.Itoa(id) + " WITH TITLE : " + Article.Title + " FAILED IN CONVERTING ARTICLE DATA WITH THIS ERROR : " + err.Error())
		}
		// fmt.Println("DONE STEP 5")
		_, _, err = SolrCallUpdate("POST", resulta)
		if err != nil {
			Logger.Error("FAILED TO INDEX ARTICLE WITH ID : " + strconv.Itoa(id) + " WITH TITLE : " + Article.Title + " FAILED IN INDEXING CONVERTED DATA WITH THIS ERROR : " + err.Error())
		}
		// fmt.Println("DONE STEP 6")
	}
	return nil
}

func (data Article_Table) ConvForSolr() (result ArticleSolr, err error) {
	result.ArticleID = strconv.Itoa(data.ArticleID)
	result.OwnerID = data.OwnerID
	result.LastEditedByID = data.LastEditedByID
	result.LastEditedTime = data.LastEditedTime
	result.Tag = dependency.ConvStringToStringArray(data.Tag)
	if err != nil {
		return result, err
	}
	result.Title = data.Title
	result.CategoryID = data.CategoryID
	result.Article = data.Article
	result.FileID, err = dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		return result, err
	}
	result.DocID, err = dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		return result, err
	}
	result.IsActive = data.IsActive
	return result, nil
}

func (data *ArticleSolr) PrepareSolrData(c echo.Context) (err error) {
	CategoryData := Category{
		CategoryID:          data.CategoryID,
		CategoryName:        "",
		CategoryParentID:    0,
		CategoryDescription: "",
	}
	err = CategoryData.Read()
	if err != nil {
		return err
	}
	data.CategoryName = CategoryData.CategoryName
	data.CategoryDescription = CategoryData.CategoryDescription
	CategoryDataParent, err := CategoryData.ListAllCategoryParent()
	if err != nil {
		return err
	}
	for _, SingleCategoryParentID := range CategoryDataParent {
		data.CategoryParent = "/" + data.CategoryParent
		SingleCategoryParent := Category{
			CategoryID:          SingleCategoryParentID,
			CategoryName:        "",
			CategoryParentID:    0,
			CategoryDescription: "",
		}
		err = SingleCategoryParent.Read()
		if err != nil {
			fmt.Println("Error When looking for category id" + strconv.Itoa(SingleCategoryParentID))
		}
		data.CategoryParent = SingleCategoryParent.CategoryName + data.CategoryParent
	}
	data.CategoryParent = data.CategoryParent[1:]
	data.OwnerName, data.OwnerUsername, err = GetNameUsername(c, data.OwnerID)
	if err != nil {
		return err
	}
	if data.OwnerID == data.LastEditedByID {
		data.LastEditedByName = data.OwnerName
		data.LastEditedByUsername = data.OwnerUsername
	} else {
		data.LastEditedByName, data.LastEditedByUsername, err = GetNameUsername(c, data.LastEditedByID)
		if err != nil {
			return err
		}
	}
	for _, SingleDocID := range data.DocID {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			Logger.Warn(err.Error())
		}
		SingleDocString, _, err := dependency.GetTextTika(Conf.Tika_link+TikaAddURL, SingleDoc.DocLoc)
		if err != nil {
			Logger.Warn(err.Error())
		}
		data.DocContent += SingleDocString
	}
	var tmpGrapesJS GrapesJS_Data
	err = json.Unmarshal([]byte(data.Article), &tmpGrapesJS)
	if err == nil {
		tmparticlepure, err := dependency.InterfaceToString(tmpGrapesJS.PagesHtml[0]["html"])
		if err == nil {
			tmparticleextracted, _, err := dependency.GetTextTikaPure(Conf.Tika_link+TikaAddURL, []byte(tmparticlepure))
			if err == nil {
				data.Article = tmparticleextracted
			} else {
				Logger.Warn(err.Error())
			}
		} else {
			Logger.Warn(err.Error())
		}
	} else {
		Logger.Warn(err.Error())
	}
	return nil
}

func SolrCall(apimethod string, SolrLinkPath string, data interface{}) ([]byte, *http.Response, error) {
	a, b, c := dependency.SolrCallUpdate(apimethod, Conf.Solr_link+SolrLinkPath, Conf.Solr_username, Conf.Solr_password, data)
	return a, b, c
}

func SolrCallUpdate(apimethod string, data interface{}) ([]byte, *http.Response, error) {
	params := url.Values{}
	params.Set("commitWithin", "1000")
	params.Set("overwrite", "true")
	// params.Set("wt", "json")
	a, b, c := dependency.SolrCallUpdate(apimethod, Conf.Solr_link+SolrV2AddURL+"?"+params.Encode(), Conf.Solr_username, Conf.Solr_password, data)
	return a, b, c
}

func SolrCallUpdateHard(apimethod string, data interface{}) ([]byte, *http.Response, error) {
	a, b, c := dependency.SolrCallUpdate(apimethod, Conf.Solr_link+SolrV2AddURL, Conf.Solr_username, Conf.Solr_password, data)
	return a, b, c
}

func SolrCallQuery(c echo.Context, q string, query string, search string, page int, num int, show string) (res []byte, header *http.Response, err error) {
	var qSolr string
	permission, user, _ := Check_Admin_Permission_API(c)
	if permission {
		qSolr = "IsActive:1"
	} else {
		role_id, err := dependency.InterfaceToInt(user["RoleID"])
		if err != nil {
			return nil, nil, err
		}
		CategoryIDList, err := GetReadCategoryList(c, role_id)
		if err != nil {
			return nil, nil, err
		}
		if len(CategoryIDList) == 0 {
			return nil, nil, errors.New("category list empty")
		}
		qSolr = "(IsActive:1"
		qSolr = qSolr + " AND CategoryID:("
		for _, SingleCategoryID := range CategoryIDList {
			qSolr += strconv.Itoa(SingleCategoryID) + " OR "
		}
		qSolr = qSolr[:len(qSolr)-4] + "))"
	}
	if q != "" {
		qSolr += " AND " + q
	}
	if search != "" {
		qSolr += " AND (title^100 OR tag^100 OR searchbar:\"" + search + "\")"
	}

	params := url.Values{}
	if num != 0 {
		params.Set("rows", strconv.Itoa(num))
	}
	if page != 0 {
		start := (page - 1) * num
		params.Set("start", strconv.Itoa(start))
	}
	params.Set("indent", "true")
	params.Set("q.op", "OR")
	params.Set("q", qSolr)
	params.Set("indent", "false")
	if show != "" {
		params.Set("fl", show)
	} else {
		params.Set("fl", "ArticleID,OwnerID,OwnerUsername,OwnerName,LastEditedByID,LastEditedByUsername,LastEditedByName,LastEditedTime,Tag,Title,CategoryID,CategoryName,CategoryParent,CategoryDescription,Article,FileID,DocID,IsActive")
	}
	if query != "" {
		res, header, err = dependency.SolrCallQuery(Conf.Solr_link+SolrV2SelectAddURL+"?"+params.Encode()+"&"+query, Conf.Solr_username, Conf.Solr_password)
	} else {
		res, header, err = dependency.SolrCallQuery(Conf.Solr_link+SolrV2SelectAddURL+"?"+params.Encode(), Conf.Solr_username, Conf.Solr_password)
	}
	return res, header, err
}

func DeleteAllSolrIndex() error {

	// Create HTTP request with basic authentication
	requestBody := []byte(`{ "delete": { "query": "*:*" } }`)

	// Create HTTP request with basic authentication
	params := url.Values{}
	params.Set("commit", "true")
	req, err := http.NewRequest("POST", Conf.Solr_link+Solrv2DeleteAddURL+"?"+params.Encode(), bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}
	req.SetBasicAuth(Conf.Solr_username, Conf.Solr_password)
	req.Header.Set("Content-Type", "application/json")

	// Send HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	// bodyresp, err := io.ReadAll(resp.Body)
	// fmt.Println(string(bodyresp))
	// if err != nil {
	// 	return err
	// }

	// body, err := io.ReadAll(resp.Body)
	// fmt.Println(string(body))
	// if err != nil {
	// 	return err
	// }

	// Check Solr's response status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("solr server returned non-200 status code: %d", resp.StatusCode)
	}

	return nil
}

func DeleteSolrDocument(id string) error {
	// Create JSON request body
	requestBody := []byte(fmt.Sprintf(`{"delete":{"id":"%s"}}`, id))

	// Create HTTP request with basic authentication
	params := url.Values{}
	params.Set("commitWithin", "1000")
	params.Set("overwrite", "true")
	params.Set("wt", "json")
	req, err := http.NewRequest("POST", Conf.Solr_link+Solrv2DeleteAddURL+"?"+params.Encode(), bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}
	req.SetBasicAuth(Conf.Solr_username, Conf.Solr_password)
	req.Header.Set("Content-Type", "application/json")

	// Send HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// body, err := io.ReadAll(resp.Body)
	// fmt.Println(string(body))
	// if err != nil {
	// 	return err
	// }

	// Check Solr's response status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("solr server returned non-200 status code: %d", resp.StatusCode)
	}

	return nil
}
