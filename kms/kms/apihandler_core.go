package kms

import (
	"dependency"
	"encoding/json"
	"errors"
	"io"
	"net/url"
	"strings"

	"github.com/labstack/echo/v4"
)

type RoleAPI struct {
	RoleID          int
	RoleName        string
	RoleParentID    int
	RoleParentName  string
	RoleDescription string
}

func CallCoreAPI(method string, dynamicpath string, body interface{}, username string, password string) (result map[string]interface{}, err error) {
	reqheader := []dependency.ApiHeader{}
	headerconnection := dependency.ApiHeader{
		HeaderKey:   "Connection",
		HeaderValue: "keep-alive",
	}
	reqheader = append(reqheader, headerconnection)
	resp, err := dependency.ApiWithBasicAuthAndJSON(method, Conf.Core_link+"/"+dynamicpath, Conf.Core_password, username+"&&"+password, body, reqheader)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	bodyresp, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		return nil, errors.New(string(bodyresp))
	}
	mapbody, err := dependency.JsonToMap(string(bodyresp))
	if err != nil {
		return mapbody, errors.New("response is not json")
	}
	mapbodydata, isexist := mapbody["Data"].(map[string]interface{})
	if isexist {
		return mapbodydata, nil
	} else {
		return nil, nil
	}
}

func CallCoreAPIPure(method string, dynamicpath string, body interface{}, username string, password string) (result map[string]interface{}, err error) {
	reqheader := []dependency.ApiHeader{}
	headerconnection := dependency.ApiHeader{
		HeaderKey:   "Connection",
		HeaderValue: "keep-alive",
	}
	reqheader = append(reqheader, headerconnection)
	resp, err := dependency.ApiWithBasicAuthAndJSON(method, Conf.Core_link+"/"+dynamicpath, Conf.Core_password, username+"&&"+password, body, reqheader)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	bodyresp, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		return nil, errors.New(string(bodyresp))
	}
	mapbody, err := dependency.JsonToMap(string(bodyresp))
	if err != nil {
		return mapbody, errors.New("response is not json")
	}
	return mapbody, nil
}

func CallCoreAPIPureNoCred(method string, dynamicpath string, body interface{}) (result map[string]interface{}, err error) {
	reqheader := []dependency.ApiHeader{}
	headerconnection := dependency.ApiHeader{
		HeaderKey:   "Connection",
		HeaderValue: "keep-alive",
	}
	reqheader = append(reqheader, headerconnection)
	jsonData, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	resp, err := dependency.ApiCall(method, Conf.Core_link+"/"+dynamicpath, jsonData, reqheader)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	bodyresp, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		return nil, errors.New(string(bodyresp))
	}
	mapbody, err := dependency.JsonToMap(string(bodyresp))
	if err != nil {
		return mapbody, errors.New("response is not json")
	}
	return mapbody, nil
}

func GetRole(c echo.Context, RoleID int) (Role RoleAPI, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")

	RoleGET, err := CallCoreAPI("GET", "role", map[string]int{"RoleID": RoleID}, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return Role, err
	}
	Role.RoleID = RoleID
	Role.RoleName, err = dependency.InterfaceToString(RoleGET["RoleName"])
	if err != nil {
		return Role, err
	}
	Role.RoleParentID, err = dependency.InterfaceToInt(RoleGET["RoleParentID"])
	if err != nil {
		return Role, err
	}
	Role.RoleParentName, err = dependency.InterfaceToString(RoleGET["RoleParentName"])
	if err != nil {
		return Role, err
	}
	Role.RoleDescription, err = dependency.InterfaceToString(RoleGET["RoleDescription"])
	if err != nil {
		return Role, err
	}
	return Role, nil
}

func GetCoreIDs(c echo.Context, path string, SortInput dependency.SortType, WhereInput dependency.WhereType) (listIDs []int, err error) {
	SortJSONString, err := json.Marshal(SortInput)
	if err != nil {
		return listIDs, err
	}
	WhereJSONString, err := json.Marshal(WhereInput)
	if err != nil {
		return listIDs, err
	}
	URLParamsValues := url.Values{}
	URLParamsValues.Add("num", "9999999999999999")
	// URLParamsValues.Add("page", "1")
	URLParamsValues.Add("sort", string(SortJSONString))
	URLParamsValues.Add("query", string(WhereJSONString))
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")

	IDsGET, err := CallCoreAPIPure("GET", path+"?"+URLParamsValues.Encode(), nil, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return listIDs, err
	}
	listIDs, isexist := IDsGET["Data"].([]int)
	if isexist {
		return listIDs, nil
	} else {
		return nil, errors.New("not returning array of int")
	}
}
