package kms

import (
	"dependency"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

type Response struct {
	StatusCode int
	Data       interface{} `json:",omitempty"`
}

type ResponseList struct {
	StatusCode int
	Data       interface{} `json:",omitempty"`
	Info       interface{} `json:",omitempty"`
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
	IsSuperAdmin, err := dependency.InterfacetoBool(User["IsSuperAdmin"])
	if err != nil {
		return false, User, err
	}
	if !IsSuperAdmin {
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

func Test_api() {
	e := echo.New()

	basicAuthMiddleware := middleware.BasicAuth(Validator)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:  []string{"*"},
		AllowHeaders:  []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderContentDisposition},
		ExposeHeaders: []string{echo.HeaderContentDisposition, echo.HeaderContentLength, echo.HeaderContentEncoding, echo.HeaderContentType},
		// AllowHeaders:  []string{echo.HeaderContentDisposition, echo.HeaderContentLength, echo.HeaderContentEncoding, echo.HeaderContentType},
	}))
	e.Use(middleware.BodyLimit(Conf.Max_upload))
	e.IPExtractor = echo.ExtractIPFromXFFHeader()

	//Logger Middleware
	LogMiddleware := middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			Logger.Info("request",
				zap.Int("status", v.Status),
				zap.String("Method", v.Method),
				zap.String("URI", v.URI),
				zap.Duration("Duration", v.Latency),
				zap.String("Client IP", v.RemoteIP),
				zap.String("Host IP", v.Host),
				zap.String("Protocol", v.Protocol),
			)
			return nil
		},
		// HandleError:      false,
		LogLatency:  true,
		LogProtocol: true,
		LogRemoteIP: true,
		LogHost:     true,
		LogMethod:   true,
		LogURI:      true,
		// LogURIPath:       false,
		// LogRoutePath:     false,
		// LogRequestID:     false,
		// LogReferer:       false,
		// LogUserAgent:     false,
		LogStatus: true,
		// LogError:         false,
		// LogContentLength: false,
		// LogResponseSize:  false,
		// LogHeaders:       []string{},
		// LogQueryParams:   []string{},
		// LogFormValues: FieldList,
	})

	// Define a protected route that requires Basic Authentication
	e.GET("/listcategory", ListCategory, basicAuthMiddleware, LogMiddleware)
	e.GET("/listcategoryid", ListCategoryID, basicAuthMiddleware, LogMiddleware)
	e.GET("/listcategoryparent", ListCategoryParent, basicAuthMiddleware, LogMiddleware)
	e.GET("/listcategorychild", ListCategoryChild, basicAuthMiddleware, LogMiddleware)
	e.GET("/category", ShowCategory, basicAuthMiddleware, LogMiddleware)
	e.POST("/category", AddCategory, basicAuthMiddleware, LogMiddleware)
	e.PUT("/category", EditCategory, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/category", DeleteCategory, basicAuthMiddleware, LogMiddleware)
	e.GET("/listpermission", ListPermission, basicAuthMiddleware, LogMiddleware)
	e.GET("/listpermissionid", ListPermissionID, basicAuthMiddleware, LogMiddleware)
	e.GET("/cudpermission", GetAnyCUDPermissionAPI, basicAuthMiddleware, LogMiddleware)
	e.GET("/permission", ShowPermission, basicAuthMiddleware, LogMiddleware)
	e.POST("/permission", AddPermission, basicAuthMiddleware, LogMiddleware)
	e.PUT("/permission", EditPermission, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/permission", DeletePermission, basicAuthMiddleware, LogMiddleware)
	e.GET("/listdoc", ListDoc, basicAuthMiddleware, LogMiddleware)
	e.GET("/listdocid", ListDocID, basicAuthMiddleware, LogMiddleware)
	e.GET("/doc", ShowDoc, basicAuthMiddleware, LogMiddleware)
	e.POST("/doc", AddDoc, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/doc", DeleteDoc, basicAuthMiddleware, LogMiddleware)
	e.GET("/listfile", ListFile, basicAuthMiddleware, LogMiddleware)
	e.GET("/listfileid", ListFileID, basicAuthMiddleware, LogMiddleware)
	e.GET("/file", ShowFile, basicAuthMiddleware, LogMiddleware)
	e.POST("/file", AddFile, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/file", DeleteFile, basicAuthMiddleware, LogMiddleware)
	e.GET("/listarticle", ListArticle, basicAuthMiddleware, LogMiddleware)
	e.GET("/listarticleid", ListArticleID, basicAuthMiddleware, LogMiddleware)
	e.GET("/queryarticle", QueryArticle, basicAuthMiddleware, LogMiddleware)
	e.GET("/articlegrapesjs", ReadArticleGrapesjs, basicAuthMiddleware, LogMiddleware)
	e.PUT("/articlegrapesjs", UpdateArticleGrapesjs, basicAuthMiddleware, LogMiddleware)
	e.POST("/article/solr", IndexArticle, basicAuthMiddleware, LogMiddleware)
	e.PUT("/article/solr", IndexArticle, basicAuthMiddleware, LogMiddleware)
	e.PUT("/article/solr/reindex", ReloadAllIndexArticle, basicAuthMiddleware, LogMiddleware)
	e.POST("/article/solr/reindex", ReloadAllIndexArticle, basicAuthMiddleware, LogMiddleware)
	e.GET("/article", ShowArticle, basicAuthMiddleware, LogMiddleware)
	e.POST("/article", AddArticle, basicAuthMiddleware, LogMiddleware)
	e.PUT("/article", EditArticle, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/article", DeleteArticle, basicAuthMiddleware, LogMiddleware)
	e.GET("/checkserverrun", CheckServerRun, LogMiddleware)

	// Start the server
	e.Logger.Fatal(e.Start(Port_conf))
}
