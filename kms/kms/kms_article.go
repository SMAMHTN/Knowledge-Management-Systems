package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

type Article_Table struct {
	ArticleID      int `json:"ArticleID" query:"ArticleID"`
	OwnerID        int
	LastEditedByID int
	LastEditedTime time.Time
	Tag            string
	Title          string
	CategoryID     int
	Article        string
	FileID         string
	DocID          string
	IsActive       int
}

type ArticleSolr struct {
	ArticleID            string
	OwnerID              int
	OwnerUsername        string
	OwnerName            string
	LastEditedByID       int
	LastEditedByUsername string
	LastEditedByName     string
	LastEditedTime       time.Time
	Tag                  []string
	Title                string
	CategoryID           int
	CategoryName         string
	CategoryParent       string
	CategoryDescription  string
	Article              string
	FileID               []int
	DocID                []int
	IsActive             int
	DocContent           string
}

func ReadArticle(args string) ([]Article_Table, error) {
	var results []Article_Table
	var sqlresult *sql.Rows
	var err error
	database, _ := dependency.Db_Connect_custom(Conf, DatabaseName, "parseTime=true")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return []Article_Table{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_article" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_article")
	}

	if err != nil {
		log.Println("WARNING " + err.Error())
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Article_Table{}
		var err = sqlresult.Scan(&result.ArticleID, &result.OwnerID, &result.LastEditedByID, &result.LastEditedTime, &result.Tag, &result.Title, &result.CategoryID, &result.Article, &result.FileID, &result.DocID, &result.IsActive)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Article_Table) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	DocIDList, err := dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, errors.New("Article DocID Error : " + err.Error())
	}
	for _, SingleDocID := range DocIDList {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			log.Println("WARNING " + err.Error())
			return 0, errors.New("Article DocID Error : " + strconv.Itoa(SingleDocID) + " " + err.Error())
		}
	}
	FileIDList, err := dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, errors.New("Article FileID Error : " + err.Error())
	}
	for _, SingleFileID := range FileIDList {
		SingleFile := File{FileID: SingleFileID}
		err = SingleFile.Read()
		if err != nil {
			log.Println("WARNING " + err.Error())
			return 0, errors.New("Article FileID Error " + strconv.Itoa(SingleFileID) + " : " + err.Error())
		}
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_article(OwnerID, LastEditedByID, LastEditedTime, Tag, Title, CategoryID, Article, FileID, DocID, IsActive) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.OwnerID, data.LastEditedByID, data.LastEditedTime, data.Tag, data.Title, data.CategoryID, data.Article, data.FileID, data.DocID, data.IsActive)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.ArticleID = int(lastid)
	return int(lastid), nil
}

func (data *Article_Table) Read() error {
	database, err := dependency.Db_Connect_custom(Conf, DatabaseName, "parseTime=true")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	if data.ArticleID != 0 {
		err = database.QueryRow("SELECT * FROM kms_article WHERE ArticleID = ?", data.ArticleID).Scan(&data.ArticleID, &data.OwnerID, &data.LastEditedByID, &data.LastEditedTime, &data.Tag, &data.Title, &data.CategoryID, &data.Article, &data.FileID, &data.DocID, &data.IsActive)
	} else {
		return errors.New("please insert articleid")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data *Article_Table) ReadShort() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	if data.ArticleID != 0 {
		err = database.QueryRow("SELECT ArticleID,OwnerID,CategoryID,FileID,DocID,IsActive FROM kms_article WHERE ArticleID = ?", data.ArticleID).Scan(&data.ArticleID, &data.OwnerID, &data.CategoryID, &data.FileID, &data.DocID, &data.IsActive)
	} else {
		return errors.New("please insert articleid")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Article_Table) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	DocIDList, err := dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return errors.New("Article DocID Error : " + err.Error())
	}
	for _, SingleDocID := range DocIDList {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			log.Println("WARNING " + err.Error())
			return errors.New("Article DocID Error : " + strconv.Itoa(SingleDocID) + " " + err.Error())
		}
	}
	FileIDList, err := dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return errors.New("Article FileID Error : " + err.Error())
	}
	for _, SingleFileID := range FileIDList {
		SingleFile := File{FileID: SingleFileID}
		err = SingleFile.Read()
		if err != nil {
			log.Println("WARNING " + err.Error())
			return errors.New("Article FileID Error " + strconv.Itoa(SingleFileID) + " : " + err.Error())
		}
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_article SET OwnerID=?, LastEditedByID=?, LastEditedTime=?, Tag=?, Title=?, CategoryID=?, Article=?, FileID=?, DocID=?, IsActive=? WHERE ArticleID=?;")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.OwnerID, data.LastEditedByID, data.LastEditedTime, data.Tag, data.Title, data.CategoryID, data.Article, data.FileID, data.DocID, data.IsActive, data.ArticleID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Article_Table) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_article WHERE `ArticleID`=?")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	if data.ArticleID != 0 {
		_, err = del.Exec(data.ArticleID)
	} else {
		return errors.New("articleid needed")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	return nil
}

func (data Article_Table) ConvForSolr() (result ArticleSolr, err error) {
	result.ArticleID = strconv.Itoa(data.ArticleID)
	result.OwnerID = data.OwnerID
	result.LastEditedByID = data.LastEditedByID
	result.LastEditedTime = data.LastEditedTime
	result.Tag, err = dependency.ConvStringToStringArray(data.Tag)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return result, err
	}
	result.Title = data.Title
	result.CategoryID = data.CategoryID
	result.Article = data.Article
	result.FileID, err = dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return result, err
	}
	result.DocID, err = dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		return err
	}
	data.CategoryName = CategoryData.CategoryName
	data.CategoryDescription = CategoryData.CategoryDescription
	CategoryDataParent, err := CategoryData.ListAllCategoryParent()
	if err != nil {
		log.Println("WARNING " + err.Error())
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
			log.Println("WARNING " + err.Error())
			fmt.Println("Error When looking for category id" + strconv.Itoa(SingleCategoryParentID))
		}
		data.CategoryParent = SingleCategoryParent.CategoryName + data.CategoryParent
	}
	data.CategoryParent = data.CategoryParent[1:]
	data.OwnerName, data.OwnerUsername, err = GetNameUsername(c, data.OwnerID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	if data.OwnerID == data.LastEditedByID {
		data.LastEditedByName = data.OwnerName
		data.LastEditedByUsername = data.OwnerUsername
	} else {
		data.LastEditedByName, data.LastEditedByUsername, err = GetNameUsername(c, data.LastEditedByID)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return err
		}
	}
	for _, SingleDocID := range data.DocID {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			log.Println("WARNING " + err.Error())
			fmt.Println(err)
		}
		SingleDocString, _, err := dependency.GetTextTika(Conf.Tika_link+TikaAddURL, SingleDoc.DocLoc)
		if err != nil {
			log.Println("WARNING " + err.Error())
			fmt.Println(err)
		}
		data.DocContent += SingleDocString
	}
	return nil
}

func ListArticle(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := Response{}
	if permission {
		DocList, _ := ReadArticle(query)
		res.StatusCode = http.StatusOK
		res.Data = DocList
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ShowArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ARTICLE NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	// err = permission_kms.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueRead || TrueUpdate || permission {
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO READ THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.Tag)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR Tag : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.FileID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR FileID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.DocID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR DocID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	TrueCreate, _, _, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueCreate || permission {
		_, err = u.Create()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "CREATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		// resulta, err := u.ConvForSolr()
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// err = resulta.PrepareSolrData(c)
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// _, _, err = SolrCallUpdate("POST", resulta)
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO CREATE ARTICLE IN THIS CATEGORY"
		return c.JSON(http.StatusForbidden, res)
	}
}

func EditArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.Tag)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR Tag : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.FileID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR FileID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.DocID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR DocID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	oriu := *u
	err = oriu.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ORIGINAL NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, _, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueUpdate || permission {
		// resulta, err := u.ConvForSolr()
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// err = resulta.PrepareSolrData(c)
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// _, _, err = SolrCallUpdate("POST", resulta)
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		err = u.Update()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO EDIT THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	oriu := u
	err = oriu.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ORIGINAL ARTICLE NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, _, _, TrueDelete, err := GetTruePermission(c, u.CategoryID, role_id)
	// err = permission_kms.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueDelete || permission {
		err = u.Delete()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DELETE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		// err = DeleteSolrDocument(strconv.Itoa(u.ArticleID))
		// if err != nil { log.Println("WARNING " + err.Error())
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "DELETE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO DELETE THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func QueryArticle(c echo.Context) error {
	var err error
	var res Response
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	q := c.QueryParam("q")
	search := c.QueryParam("search")
	query := c.QueryParam("query")
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	CategoryIDList, err := GetReadCategoryList(c, role_id)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	response, _, err := SolrCallQuery(CategoryIDList, q, query, search)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = string(response)
	return c.JSON(http.StatusOK, res)
}
