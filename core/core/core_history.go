package core

import (
	"dependency"
	"net/http"
	t "time"

	"github.com/labstack/echo/v4"
)

type HistoryAPI struct {
	History
	HistoryID    int `json:"HistoryID" query:"HistoryID"`
	ActivityType string
	Time         string
	UserID       int
	UserName     string
	UserUserName string
	Changes      string
	IPAddress    string
}

func AddHistory(c echo.Context) error {
	res := Response{}
	var err error
	u := new(HistoryAPI)
	r := EmptyHistory()
	_, now_user, _ := Check_Permission_API(c)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	r, err = u.ToTable()
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.UserID > 0 {
		r.UserID = u.UserID
	} else {
		r.UserID = now_user.UserID
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
	res := ResponseList{}
	limit := new(dependency.LimitType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	permission, _, _ := Check_Permission_API(c)
	if permission {
		var LimitQuery string
		TotalRow, err := CountRows("core_history")
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		LimitQuery, res.Info = limit.LimitMaker(TotalRow)
		Histories, _ := ReadHistory(query + " " + LimitQuery)
		HistoriesAPI := []HistoryAPI{}
		for _, y := range Histories {
			HistoriesAPI = append(HistoriesAPI, y.ToAPI())
		}
		res.StatusCode = http.StatusOK
		res.Data = HistoriesAPI
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func RecordHistory(c echo.Context, ActivityType string, Changes string) error {
	r := EmptyHistory()
	_, now_user, _ := Check_Permission_API(c)
	r.ActivityType = ActivityType
	r.Changes = Changes
	r.UserID = now_user.UserID
	r.IPAddress = c.RealIP()
	_, err := r.Create()
	if err != nil {
		return err
	}
	return nil
}

func (data History) ToAPI() (res HistoryAPI) {
	res = HistoryAPI{
		HistoryID:    data.HistoryID,
		ActivityType: data.ActivityType,
		Time:         data.Time.Format(t.RFC3339),
		UserID:       data.UserID,
		UserName:     "",
		UserUserName: "",
		Changes:      data.Changes,
		IPAddress:    data.IPAddress,
	}
	HistoryUser := User{UserID: data.UserID}
	err := HistoryUser.ReadWithoutPhoto()
	if err != nil {
		res.UserName = ""
		res.UserUserName = ""
	} else {
		res.UserName = HistoryUser.Name
		res.UserUserName = HistoryUser.Username
	}
	return res
}
func (data HistoryAPI) ToTable() (res History, err error) {
	res = History{
		HistoryID:    data.HistoryID,
		ActivityType: data.ActivityType,
		Time:         t.Time{},
		UserID:       0,
		Changes:      data.Changes,
		IPAddress:    data.IPAddress,
	}
	if data.UserID > 0 {
		res.UserID = data.UserID
	}
	if data.Time != "" {
		res.Time, err = t.Parse(t.RFC3339, data.Time)
		if err != nil {
			Logger.Error("Please use time format RFC3339" + err.Error())
			return res, err
		}
	}
	return res, nil
}
