package main

import (
	"core"
	"fmt"
	"strconv"
)

func DummyCreate(i int) {
	r := core.EmptyHistory()
	r.ActivityType = "Dummy"
	r.Changes = "Perubahan dummy ke - " + strconv.Itoa(i)
	r.UserID = 1
	r.IPAddress = "192.168.1.1"
	_, err := r.Create()
	if err != nil {
		panic(err)
	}
	fmt.Println(i)
}

func main() {
	defer core.Database.Close()
	go core.Test_api()
	for i := 1; i <= 10000000; i++ {
		DummyCreate(i)
	}
	// his := core.EmptyHistory()
	// his.Create()
	// core.Test_api()
	// fmt.Println("core.EditSetting\n\t/core/core/core_setting.go:43\ngithub.com/labstack/echo/v4/middleware.BasicAuthWithConfig.func1.1\n\t/go/pkg/mod/github.com/labstack/echo/v4@v4.10.2/middleware/basic_auth.go:93\ngithub.com/labstack/echo/v4.(*Echo).add.func1\n\t/go/pkg/mod/github.com/labstack/echo/v4@v4.10.2/echo.go:575\ngithub.com/labstack/echo/v4/middleware.BodyLimitWithConfig.func1.1\n\t/go/pkg/mod/github.com/labstack/echo/v4@v4.10.2/middleware/body_limit.go:87\ngithub.com/labstack/echo/v4/middleware.CORSWithConfig.func1.1\n\t/go/pkg/mod/github.com/labstack/echo/v4@v4.10.2/middleware/cors.go:199\ngithub.com/labstack/echo/v4.(*Echo).ServeHTTP\n\t/go/pkg/mod/github.com/labstack/echo/v4@v4.10.2/echo.go:662\nnet/http.serverHandler.ServeHTTP\n\t/usr/local/go/src/net/http/server.go:2936\nnet/http.(*conn).serve\n\t/usr/local/go/src/net/http/server.go:1995")
}
