package core

import (
	"database/sql"
	"dependency"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Theme struct {
	AppthemeID    int `json:"AppthemeID" query:"AppthemeID"`
	AppthemeName  string
	AppthemeValue string //json
}

func ReadTheme(args string) ([]Theme, error) {
	var results []Theme
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []Theme{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_theme" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_theme")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Theme{}
		var err = sqlresult.Scan(&result.AppthemeID, &result.AppthemeName, &result.AppthemeValue)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Theme) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_theme(AppthemeName, AppthemeValue) VALUES(?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.AppthemeName, data.AppthemeValue)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.AppthemeID = int(lastid)
	return int(lastid), nil
}

func (data *Theme) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.AppthemeID != 0 {
		err = database.QueryRow("SELECT * FROM core_theme WHERE AppthemeID = ?", data.AppthemeID).Scan(&data.AppthemeID, &data.AppthemeName, &data.AppthemeValue)
	} else {
		return errors.New("please insert appthemeid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Theme) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_theme SET AppthemeName=?, AppthemeValue=? WHERE AppthemeID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.AppthemeName, data.AppthemeValue, data.AppthemeID)
	if err != nil {
		return err
	}
	return nil
}

func (data Theme) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM core_theme WHERE `AppthemeID`=?")
	if err != nil {
		return err
	}
	if data.AppthemeID != 0 {
		_, err = del.Exec(data.AppthemeID)
	} else {
		return errors.New("appthemeid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func ListTheme(c echo.Context) error {
	query := c.QueryParam("query")
	res := Response{}
	listtheme, _ := ReadTheme(query)
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
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
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
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = u.Create()
	if err != nil {
		res.StatusCode = http.StatusConflict
		res.Data = err.Error()
		return c.JSON(http.StatusConflict, res)
	}
	u.Read()
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}

func EditTheme(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Theme)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Update()
		if err != nil {
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteTheme(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Theme)
	err = c.Bind(u)
	if err != nil || u.AppthemeID == 1 {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Delete()
		if err != nil {
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED THEME " + strconv.Itoa(u.AppthemeID)
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}
