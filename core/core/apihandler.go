package core

import (
	"dependency"
	"net/http"
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

	//Auth Middleware
	basicAuthMiddleware := middleware.BasicAuth(Validator)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
	}))
	e.Use(middleware.BodyLimit("8M"))
	e.IPExtractor = echo.ExtractIPFromXFFHeader()

	//Logger Middleware
	// var FieldList []string
	// FieldList = append(FieldList, dependency.GetFieldNames(dependency.QueryType{})...)
	// FieldList = append(FieldList, dependency.GetFieldNames(User_API{})...)
	// FieldList = append(FieldList, dependency.GetFieldNames(HistoryAPI{})...)
	// FieldList = append(FieldList, dependency.GetFieldNames(RoleAPI{})...)
	// FieldList = append(FieldList, dependency.GetFieldNames(Theme{})...)
	// FieldList = append(FieldList, dependency.GetFieldNames(Setting_API{})...)
	// fmt.Println(FieldList)
	// SugaredLogger := Logger.Sugar()
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
			// SugaredLogger.Info("request",
			// 	"URI", v.URI,
			// 	"Time", v.StartTime,
			// 	"Duration", v.Latency,
			// 	"Protocol", v.Protocol,
			// 	"Client IP", v.RemoteIP,
			// 	"Host IP", v.Host,
			// 	"Method", v.Method,
			// 	"status", v.Status,
			// 	"Request Body", v.FormValues,
			// )
			// fmt.Println(v.FormValues)
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
	e.GET("/login", Login, basicAuthMiddleware, LogMiddleware)
	e.GET("/checkuserexist", CheckUserExist, basicAuthMiddleware, LogMiddleware)
	e.GET("/loginuser", LoginUser, basicAuthMiddleware, LogMiddleware)
	e.GET("/listuser", ListUser, basicAuthMiddleware, LogMiddleware)
	e.GET("/listuserid", ListUserID, basicAuthMiddleware, LogMiddleware)
	e.GET("/user", ShowUser, basicAuthMiddleware, LogMiddleware)
	e.POST("/user", AddUser, basicAuthMiddleware, LogMiddleware)
	e.PUT("/user", EditUser, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/user", DeleteUser, basicAuthMiddleware, LogMiddleware)
	e.GET("/listrole", ListRole, basicAuthMiddleware, LogMiddleware)
	e.GET("/listroleid", ListRoleID, basicAuthMiddleware, LogMiddleware)
	e.GET("/checkroleexist", CheckRoleExist, basicAuthMiddleware, LogMiddleware)
	e.GET("/listrolechild", ListRoleChild, basicAuthMiddleware, LogMiddleware)
	e.GET("/role", ShowRole, basicAuthMiddleware, LogMiddleware)
	e.POST("/role", AddRole, basicAuthMiddleware, LogMiddleware)
	e.PUT("/role", EditRole, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/role", DeleteRole, basicAuthMiddleware, LogMiddleware)
	e.GET("/listhistory", ListHistory, basicAuthMiddleware, LogMiddleware)
	e.POST("/history", AddHistory, basicAuthMiddleware, LogMiddleware)
	e.GET("/listtheme", ListTheme, basicAuthMiddleware, LogMiddleware)
	e.GET("/listthemeid", ListThemeID, basicAuthMiddleware, LogMiddleware)
	e.GET("/theme", ShowTheme, basicAuthMiddleware, LogMiddleware)
	e.POST("/theme", AddTheme, basicAuthMiddleware, LogMiddleware)
	e.PUT("/theme", EditTheme, basicAuthMiddleware, LogMiddleware)
	e.DELETE("/theme", DeleteTheme, basicAuthMiddleware, LogMiddleware)
	e.GET("/setting", ShowSetting, LogMiddleware)
	e.PUT("/setting", EditSetting, basicAuthMiddleware, LogMiddleware)
	e.GET("/checkserverrun", CheckServerRun, LogMiddleware)
	e.GET("/tz", ExtractTimeZoneAPI, LogMiddleware)

	// Start the server
	e.Logger.Fatal(e.Start(Port_conf))
}
