package kms

import (
	"dependency"
	"errors"

	"github.com/labstack/echo/v4"
)

type History struct {
	ActivityType string
	UserID       int
	Changes      string
	IPAddress    string
}

func RecordHistory(c echo.Context, ActivityType string, Changes string) error {
	var err error
	r := History{
		ActivityType: ActivityType,
		UserID:       0,
		Changes:      Changes,
		IPAddress:    "",
	}
	_, now_user, _ := Check_Admin_Permission_API(c)
	r.ActivityType = ActivityType
	r.Changes = Changes
	r.UserID, err = dependency.InterfaceToInt(now_user["UserID"])
	if err != nil {
		return err
	}
	username, err := dependency.InterfaceToString(now_user["Username"])
	if err != nil {
		return err
	}
	password, err := dependency.InterfaceToString(now_user["Password"])
	if err != nil {
		return err
	}
	r.IPAddress = c.RealIP()
	_, err = CallCoreAPI("POST", "history", r, username, password)
	if err != nil {
		return err
	}
	return nil
}

func GetTimeZone() (timezone string, err error) {
	response, err := CallCoreAPINoCred("GET", "tz", nil)
	if err != nil {
		return "", err
	}
	responsedata, isexist := response["Data"].(string)
	if !isexist {
		return "", errors.New("data not found")
	}
	return responsedata, nil
}

// UNUSED
func CountRows(tableName string) (int, error) {
	var count int
	query := "SELECT COUNT(*) FROM " + tableName

	err := Database.QueryRow(query).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}
