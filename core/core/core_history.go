package core

import (
	"database/sql"
	"dependency"
	"errors"
	"net/http"
	"strings"
	t "time"

	"github.com/labstack/echo/v4"
)

type History struct {
	HistoryID    int `json:"HistoryID" query:"HistoryID"`
	ActivityType string
	Time         t.Time
	UserID       int
	Changes      string
	IPAddress    string
}

type HistoryAPI struct {
	HistoryID    int `json:"HistoryID" query:"HistoryID"`
	ActivityType string
	Time         string
	UserID       int
	Changes      string
	IPAddress    string
}

func EmptyHistory() History {
	return History{HistoryID: 0, ActivityType: "Test", Time: t.Now(), UserID: 1, Changes: "Test", IPAddress: "21120119120026"}
}

func ReadHistory(args string) ([]History, error) {
	var results []History
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect_custom(Conf, DatabaseName, "parseTime=true")
	if err != nil {
		return []History{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_history" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_history")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = History{}
		var err = sqlresult.Scan(&result.HistoryID, &result.ActivityType, &result.Time, &result.UserID, &result.Changes, &result.IPAddress)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data History) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_history(ActivityType, `Time`, UserID, Changes, IPAddress) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.ActivityType, data.Time, data.UserID, data.Changes, data.IPAddress)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	return int(lastid), nil
}

func (data *History) Read() error {
	database, err := dependency.Db_Connect_custom(Conf, DatabaseName, "parseTime=true")
	if err != nil {
		return err
	}
	defer database.Close()
	if data.HistoryID != 0 {
		err = database.QueryRow("SELECT * FROM core_history WHERE HistoryID = ?", data.HistoryID).Scan(&data.HistoryID, &data.ActivityType, &data.Time, &data.UserID, &data.Changes, &data.IPAddress)
	} else {
		return errors.New("please insert historyid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data History) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_history SET ActivityType=?, `Time`=?, UserID=?, Changes=?, IPAddress=? WHERE HistoryID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.ActivityType, data.Time, data.UserID, data.Changes, data.IPAddress, data.HistoryID)
	if err != nil {
		return err
	}
	return nil
}

func (data History) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM core_history WHERE `HistoryID`=?")
	if err != nil {
		return err
	}
	if data.HistoryID != 0 {
		_, err = del.Exec(data.HistoryID)
	} else {
		return errors.New("HistoryID Needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func AddHistory(c echo.Context) error {
	res := Response{}
	var err error
	u := new(HistoryAPI)
	r := EmptyHistory()
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	now_user := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	now_user.Read()
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	r.ActivityType = u.ActivityType
	r.Changes = u.Changes
	r.IPAddress = u.IPAddress
	if u.UserID > 0 {
		r.UserID = u.UserID
	} else {
		r.UserID = now_user.UserID
	}
	if u.Time != "" {
		r.Time, err = t.Parse(t.RFC3339, u.Time)
		if err != nil {
			res.StatusCode = http.StatusUnsupportedMediaType
			res.Data = "Please use time format RFC3339"
			return c.JSON(http.StatusUnsupportedMediaType, res)
		}
	}
	resultid, _ := r.Create()
	r.HistoryID = resultid
	r.Read()
	res.StatusCode = http.StatusOK
	res.Data = r
	return c.JSON(http.StatusOK, res)
}

func ListHistory(c echo.Context) error {
	query := c.QueryParam("query")
	res := Response{}
	permission, _, _ := Check_Permission_API(c)
	if permission {
		Histories, _ := ReadHistory(query)
		res.StatusCode = http.StatusOK
		res.Data = Histories
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}
