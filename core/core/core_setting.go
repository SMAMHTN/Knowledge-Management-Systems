package core

import (
	"dependency"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type Setting_API struct {
	CompanyID      int    `json:"CompanyID" query:"CompanyID"`
	CompanyName    string `json:"CompanyName"`
	CompanyLogo    string `json:"CompanyLogo"`
	CompanyAddress string `json:"CompanyAddress"`
	TimeZone       string `json:"TimeZone"`
	AppthemeID     int    `json:"AppthemeID"`
	AppthemeName   string `json:"AppthemeName"`
}

func ShowSetting(c echo.Context) error {
	// var err error
	res := Response{}
	u := new(Setting)
	u.CompanyID = 1
	u.Read()
	uAPI := u.ToAPI()
	res.StatusCode = http.StatusOK
	res.Data = uAPI
	return c.JSON(http.StatusOK, res)
}

func ShowCompanyLogo(c echo.Context) error {
	res := Response{}
	u := new(Setting)
	u.CompanyID = 1
	u.Read()
	fmt.Println(dependency.BytesToBase64(u.CompanyLogo))
	imageData, err := base64.StdEncoding.DecodeString(dependency.BytesToBase64(u.CompanyLogo))
	if err != nil {
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = "Error Decoding Image, please change company image : " + err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
	}
	return c.Blob(http.StatusOK, "image", imageData)
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
	u := new(Setting_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	u.CompanyID = 1
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		*u = uOri.ToAPI()
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

func (data Setting_API) ToTable() (res Setting, err error) {
	_, err = time.LoadLocation(data.TimeZone)
	if err != nil {
		return res, err
	}
	res.CompanyLogo, err = dependency.Base64ToBytes(data.CompanyLogo)
	if err != nil {
		return res, err
	}
	res.CompanyID = data.CompanyID
	res.CompanyName = data.CompanyName
	res.CompanyAddress = data.CompanyAddress
	res.TimeZone = data.TimeZone
	res.AppthemeID = data.AppthemeID
	return res, nil
}

func (data Setting) ToAPI() (res Setting_API) {
	res.CompanyID = data.CompanyID
	res.CompanyName = data.CompanyName
	res.CompanyLogo = dependency.BytesToBase64(data.CompanyLogo)
	res.CompanyAddress = data.CompanyAddress
	res.TimeZone = data.TimeZone
	res.AppthemeID = data.AppthemeID
	CompanyApptheme := Theme{AppthemeID: data.AppthemeID}
	res.AppthemeName = CompanyApptheme.AppthemeName
	return res
}
