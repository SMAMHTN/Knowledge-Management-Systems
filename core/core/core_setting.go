package core

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func ShowSetting(c echo.Context) error {
	// var err error
	res := Response{}
	u := new(Setting)
	u.CompanyID = 1
	_ = u.ReadAPI()
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}

func ExtractTimeZoneAPI(c echo.Context) error {
	res := Response{}
	res.StatusCode = http.StatusOK
	res.Data = GetTimeZone()
	return c.JSON(http.StatusOK, res)
}

func EditSetting(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Setting)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	u.CompanyID = 1
	if permission {
		err = u.UpdateAPI()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Setting", "User "+now_user.Name+"("+now_user.Username+") Changed Setting")
		if err != nil {
			Logger.Error(" failed to record setting change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}
