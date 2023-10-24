package kms

import (
	"dependency"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type SolrResponse struct {
	ResponseHeader map[string]interface{} `json:"ResponseHeader"`
	Response       map[string]interface{} `json:"response"`
}

func QueryArticle(c echo.Context) error {
	var err error
	var res Response
	var page int
	var num int
	query := c.QueryParam("query")
	q := c.QueryParam("q")
	search := c.QueryParam("search")
	pageString := c.QueryParam("page")
	show := c.QueryParam("show")
	if pageString != "" {
		page, err = strconv.Atoi(pageString)
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DATA INPUT ERROR : PAGE IS NOT A NUMBER - " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
	}
	numString := c.QueryParam("num")
	if numString != "" {
		num, err = strconv.Atoi(numString)
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DATA INPUT ERROR : NUM IS NOT A NUMBER - " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
	}
	response, _, err := SolrCallQuery(c, q, query, search, page, num, show)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = string(response)
	var a SolrResponse
	err = json.Unmarshal(response, &a)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(a.Response)
	fmt.Println(a.Response["numFound"])
	return c.JSON(http.StatusOK, res)
}

func IndexArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	oriu, err := u.ToTable()
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	err = oriu.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ORIGINAL ARTICLE NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	TrueCreate, _, TrueUpdate, _, err := GetTruePermission(c, oriu.CategoryID, role_id)
	// err = permission_kms.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueCreate || TrueUpdate || permission {
		resulta, err := oriu.ConvForSolr()
		if err != nil {
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		err = resulta.PrepareSolrData(c)
		if err != nil {
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		_, _, err = SolrCallUpdate("POST", resulta)
		if err != nil {
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Article", "Indexed Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
		if err != nil {
			Logger.Error("failed to record article change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO DELETE THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}
