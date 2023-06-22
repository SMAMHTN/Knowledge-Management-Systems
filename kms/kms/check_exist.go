package kms

import (
	"dependency"
	"strings"

	"github.com/labstack/echo/v4"
)

func Check_Role_Exist(c echo.Context, RoleID int) (bool, error) {
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	checkroleid := map[string]int{
		"RoleID": RoleID,
	}
	_, err := CallCoreAPI("GET", "checkroleexist", checkroleid, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return false, err
	}
	return true, nil
}

func Check_User_Exist(c echo.Context, UserID int) (bool, error) {
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	checkroleid := map[string]int{
		"RoleID": UserID,
	}
	_, err := CallCoreAPI("GET", "checkroleexist", checkroleid, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return false, err
	}
	return true, nil
}

func Check_Role_Exist_test(RoleID int) (bool, error) {
	checkroleid := map[string]int{
		"RoleID": RoleID,
	}
	_, err := CallCoreAPI("GET", "checkroleexist", checkroleid, "administrator", "admin")
	if err != nil {
		return false, nil
	}
	return true, nil
}

func Check_User_Exist_test(UserID int) (bool, error) {
	checkroleid := map[string]int{
		"RoleID": UserID,
	}
	_, err := CallCoreAPI("GET", "checkroleexist", checkroleid, "administrator", "admin")
	if err != nil {
		return false, nil
	}
	return true, nil
}
