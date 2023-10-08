package core

import (
	"dependency"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func ListTheme(c echo.Context) error {
	res := ResponseList{}
	limit := new(dependency.QueryType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	var LimitQuery string
	var ValuesQuery []interface{}
	TotalRow, err := CountRows("core_theme")
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(TotalRow)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	listtheme, _ := ReadTheme(LimitQuery, ValuesQuery)
	res.StatusCode = http.StatusOK
	res.Data = listtheme
	return c.JSON(http.StatusOK, res)
}

func ShowTheme(c echo.Context) error {
	var err error
	res := Response{}
	u := new(Theme)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusNotFound
		res.Data = "THEME NOT FOUND"
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}

func AddTheme(c echo.Context) error {
	var err error
	res := Response{}
	u := new(Theme)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = u.Create()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusConflict
		res.Data = err.Error()
		return c.JSON(http.StatusConflict, res)
	}
	u.Read()
	res.StatusCode = http.StatusOK
	res.Data = u
	_, now_user, _ := Check_Permission_API(c)
	err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Added Theme : "+u.AppthemeName+"("+strconv.Itoa(u.AppthemeID)+")")
	if err != nil {
		Logger.Error(" failed to record theme change history " + err.Error())
	}
	return c.JSON(http.StatusOK, res)
}

func EditTheme(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Theme)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Edited Theme : "+u.AppthemeName+"("+strconv.Itoa(u.AppthemeID)+")")
		if err != nil {
			Logger.Error(" failed to record theme change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteTheme(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Theme)
	err = c.Bind(u)
	if u.AppthemeID == 1 {
		res.StatusCode = http.StatusBadRequest
		res.Data = "You Cannot Delete this Role because this role constrain used by system"
		return c.JSON(http.StatusBadRequest, res)
	}
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Delete()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED THEME " + strconv.Itoa(u.AppthemeID)
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Deleted Theme : "+u.AppthemeName+"("+strconv.Itoa(u.AppthemeID)+")")
		if err != nil {
			Logger.Error(" failed to record theme change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}
