package core

import (
	"dependency"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Response struct {
	StatusCode int
	Data       interface{} `json:",omitempty"`
}

type IDSearch struct {
	ID int `param:"id" query:"id" form:"id" json:"id" xml:"id"`
}

func CheckServerRun(c echo.Context) error {
	res := Response{StatusCode: http.StatusOK}
	return c.JSON(http.StatusOK, res)
}

func Login(c echo.Context) error {
	res := Response{StatusCode: http.StatusOK}
	return c.JSON(http.StatusOK, res)
}

func Check_Permission_API(c echo.Context) (bool, User, error) {
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	now_user := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	err := now_user.ReadLogin()
	if err != nil {
		return false, now_user, err
	}
	if now_user.IsSuperAdmin == 0 {
		return false, now_user, nil
	} else {
		return true, now_user, nil
	}
}

var Port_conf string

// Define the BasicAuth middleware with a validator function
var Validator = func(username, password string, c echo.Context) (bool, error) {
	cred := strings.Split(password, "&&")
	usercek := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	err := usercek.ReadLogin()
	if username == Conf.App_password && err == nil {
		return true, nil
	}
	return false, nil
}

var ValidatorLogin = func(username, password string, c echo.Context) (bool, error) {
	if username == Conf.App_password && password == "" {
		return true, nil
	}
	return false, nil
}

func Test_api() {
	e := echo.New()

	basicAuthMiddleware := middleware.BasicAuth(Validator)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
	}))
	e.Use(middleware.BodyLimit("8M"))
	e.IPExtractor = echo.ExtractIPFromXFFHeader()

	// Define a protected route that requires Basic Authentication
	e.GET("/login", Login, basicAuthMiddleware)
	e.GET("/checkuserexist", CheckUserExist, basicAuthMiddleware)
	e.GET("/loginuser", LoginUser, basicAuthMiddleware)
	e.GET("/listuser", ListUser, basicAuthMiddleware)
	e.GET("/user", ShowUser, basicAuthMiddleware)
	e.POST("/user", AddUser, basicAuthMiddleware)
	e.PUT("/user", EditUser, basicAuthMiddleware)
	e.DELETE("/user", DeleteUser, basicAuthMiddleware)
	e.GET("/listrole", ListRole, basicAuthMiddleware)
	e.GET("/checkroleexist", CheckRoleExist, basicAuthMiddleware)
	e.GET("/listrolechild", ListRoleChild, basicAuthMiddleware)
	e.GET("/role", ShowRole, basicAuthMiddleware)
	e.POST("/role", AddRole, basicAuthMiddleware)
	e.PUT("/role", EditRole, basicAuthMiddleware)
	e.DELETE("/role", DeleteRole, basicAuthMiddleware)
	e.GET("/listhistory", ListHistory, basicAuthMiddleware)
	e.POST("/history", AddHistory, basicAuthMiddleware)
	e.GET("/listtheme", ListTheme, basicAuthMiddleware)
	e.GET("/theme", ShowTheme, basicAuthMiddleware)
	e.POST("/theme", AddTheme, basicAuthMiddleware)
	e.PUT("/theme", EditTheme, basicAuthMiddleware)
	e.DELETE("/theme", DeleteTheme, basicAuthMiddleware)
	e.GET("/setting", ShowSetting)
	e.PUT("/setting", EditSetting, basicAuthMiddleware)
	e.GET("/checkserverrun", CheckServerRun)
	e.GET("/tz", ExtractTimeZoneAPI)

	// Start the server
	e.Logger.Fatal(e.Start(Port_conf))
}
