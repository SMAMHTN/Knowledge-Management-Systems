package core

import (
	"dependency"
	"net/http"
	t "time"

	"github.com/labstack/echo/v4"
)

type HistoryAPI struct {
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
	res := ResponseList{}
	limit := new(dependency.QueryType)
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
		var ValuesQuery []interface{}
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(HistoryAnotherTable, nil, nil, Database, "core_history")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		Histories, _ := ReadHistory(LimitQuery, ValuesQuery)
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

func HistoryAnotherTable(Sort []dependency.SortType, Where []dependency.WhereType) (ResSort []dependency.SortType, ResWhere []dependency.WhereType, err error) {
	var sortuserposition int
	var sortuser []dependency.SortType
	var whereuserfirstposition bool
	var whereuser []dependency.WhereType
	for x, y := range Sort {
		switch y.Field {
		case "UserName", "UserUserName":
			if sortuserposition == 0 {
				sortuserposition = x + 1
			}
			y.Field = y.Field[4:]
			sortuser = append(sortuser, y)
		default:
			ResSort = append(ResSort, y)
		}
	}
	for a, b := range Where {
		switch b.Field {
		case "UserName", "UserUserName":
			if !whereuserfirstposition && a == 0 {
				whereuserfirstposition = true
			}
			b.Field = b.Field[4:]
			whereuser = append(whereuser, b)
		default:
			ResWhere = append(ResWhere, b)
		}
	}
	if len(sortuser) > 0 || len(whereuser) > 0 {
		tmpquery, tmpvalue, err := dependency.SortQueryMaker("", nil, sortuser, whereuser)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		UserIDs, err := ReadUserIDWithoutPhoto(tmpquery, tmpvalue)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortuser) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(UserID," + dependency.ConvIntArrayToString(UserIDs) + ")",
				Ascending: sortuser[0].Ascending,
			}
			ResSort = append(ResSort[:sortuserposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortuserposition-1:]...)...)
		}
		if len(whereuser) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "UserID",
				Operator: whereuser[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(UserIDs),
			}
			if whereuserfirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere)
			}
		}
	}
	return ResSort, ResWhere, nil
}
