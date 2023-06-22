package kms

import (
	"bytes"
	"dependency"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Response struct {
	StatusCode int
	Data       interface{} `json:",omitempty"`
}

type DataArrayAPI struct {
	Values []string `json:"Data"`
}

// type IDSearch struct {
// 	ID int `param:"id" query:"id" form:"id" json:"id" xml:"id"`
// }

func Login(c echo.Context) error {
	var1, _, _ := Check_Admin_Permission_API(c)
	res := Response{StatusCode: http.StatusOK, Data: var1}
	return c.JSON(http.StatusOK, res)
}

var Port_conf = ":" + strconv.Itoa(Conf.Appport)

// Define the BasicAuth middleware with a validator function
var Validator = func(username, password string, c echo.Context) (bool, error) {
	cred := strings.Split(password, "&&")
	_, err := CallCoreAPI("GET", "login", nil, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	// usercek := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	// err := usercek.ReadLogin()
	if username == Conf.App_password && err == nil {
		return true, nil
	}
	return false, nil
}

func Check_Admin_Permission_API(c echo.Context) (bool, map[string]interface{}, error) {
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	User, err := CallCoreAPI("GET", "loginuser", nil, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return false, User, err
	}
	IsSuperAdmin, err := dependency.InterfaceToInt(User["IsSuperAdmin"])
	if err != nil {
		return false, User, err
	}
	if IsSuperAdmin == 0 {
		return false, User, nil
	} else {
		return true, User, nil
	}
}

func GetNameUsername(c echo.Context, UserID int) (Name string, Username string, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")

	User, err := CallCoreAPI("GET", "checkuserexist", map[string]int{"UserID": UserID}, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return "", "", err
	}
	Name, err = dependency.InterfaceToString(User["Name"])
	if err != nil {
		return "", "", err
	}
	Username, err = dependency.InterfaceToString(User["Username"])
	if err != nil {
		return "", "", err
	}
	return Name, Username, nil
}

var ValidatorLogin = func(username, password string, c echo.Context) (bool, error) {
	if username == Conf.App_password && password == "" {
		return true, nil
	}
	return false, nil
}

func CheckServerRun(c echo.Context) error {
	res := Response{StatusCode: http.StatusOK}
	return c.JSON(http.StatusOK, res)
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

func SolrCallQuery(CategoryIDList []int, q string, query string, search string) ([]byte, *http.Response, error) {
	if len(CategoryIDList) == 0 {
		return nil, nil, errors.New("category list empty")
	}
	qSolr := "(IsActive:1 AND CategoryID:("
	for _, SingleCategoryID := range CategoryIDList {
		qSolr += strconv.Itoa(SingleCategoryID) + " OR "
	}
	qSolr = qSolr[:len(qSolr)-4] + "))"
	if q != "" {
		qSolr += " AND " + q
	}
	if search != "" {
		qSolr += " AND searchbar=" + search
	}
	params := url.Values{}
	params.Set("indent", "true")
	params.Set("q.op", "AND")
	params.Set("q", qSolr)
	params.Set("fl", "ArticleID,OwnerID,OwnerUsername,OwnerName,LastEditedByID,LastEditedByUsername,LastEditedByName,LastEditedTime,Tag,Title,CategoryID,CategoryName,CategoryParent,CategoryDescription,Article,FileID,DocID,IsActive")
	res, header, err := dependency.SolrCallQuery(Conf.Solr_link+SolrV2SelectAddURL+"?"+params.Encode()+"&"+query, Conf.Solr_username, Conf.Solr_password)
	return res, header, err
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

func Test_api() {
	e := echo.New()

	basicAuthMiddleware := middleware.BasicAuth(Validator)

	// Define a protected route that requires Basic Authentication
	e.GET("/listcategory", ListCategory, basicAuthMiddleware)
	e.GET("/listcategoryparent", ListCategoryParent, basicAuthMiddleware)
	e.GET("/listcategorychild", ListCategoryChild, basicAuthMiddleware)
	e.GET("/category", ShowCategory, basicAuthMiddleware)
	e.POST("/category", AddCategory, basicAuthMiddleware)
	e.PUT("/category", EditCategory, basicAuthMiddleware)
	e.DELETE("/category", DeleteCategory, basicAuthMiddleware)
	e.GET("/listpermission", ListPermission, basicAuthMiddleware)
	e.GET("/permission", ShowPermission, basicAuthMiddleware)
	e.POST("/permission", AddPermission, basicAuthMiddleware)
	e.PUT("/permission", EditPermission, basicAuthMiddleware)
	e.DELETE("/permission", DeletePermission, basicAuthMiddleware)
	e.GET("/listdoc", ListDoc, basicAuthMiddleware)
	e.GET("/doc", ShowDoc, basicAuthMiddleware)
	e.POST("/doc", AddDoc, basicAuthMiddleware)
	e.DELETE("/doc", DeleteDoc, basicAuthMiddleware)
	e.GET("/listfile", ListFile, basicAuthMiddleware)
	e.GET("/file", ShowFile, basicAuthMiddleware)
	e.POST("/file", AddFile, basicAuthMiddleware)
	e.DELETE("/file", DeleteFile, basicAuthMiddleware)
	e.GET("/listarticle", ListArticle, basicAuthMiddleware)
	e.GET("/queryarticle", QueryArticle, basicAuthMiddleware)
	e.GET("/article", ShowArticle, basicAuthMiddleware)
	e.POST("/article", AddArticle, basicAuthMiddleware)
	e.PUT("/article", EditArticle, basicAuthMiddleware)
	e.DELETE("/article", DeleteArticle, basicAuthMiddleware)
	e.GET("/checkserverrun", CheckServerRun)

	// Start the server
	e.Logger.Fatal(e.Start(Port_conf))
}
