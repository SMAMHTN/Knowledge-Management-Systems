package kms

import (
	"dependency"
	"errors"
	"io"
)

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
	mapbody, err := dependency.JsonToMap(string(bodyresp))
	if err != nil {
		return mapbody, errors.New("response is not json")
	}
	return mapbody, nil
}
