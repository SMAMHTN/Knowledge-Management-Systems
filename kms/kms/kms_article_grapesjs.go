package kms

import (
	"dependency"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type Article_GrapesJS struct {
	StatusCode int
	Id         int                    `json:"id" query:"id"`
	Data       string                 `json:"data"`
	Dumpvalue  map[string]interface{} `json:"dump"`
}

type GrapesJS_Data struct {
	Data      map[string]interface{}   `json:"data"`
	PagesHtml []map[string]interface{} `json:"pagesHtml"`
}

func UpdateArticleGrapesjs(c echo.Context) error {
	var err error
	var res Article_GrapesJS
	u := new(Article_GrapesJS)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	u.Data, err = dependency.MapToJson(u.Dumpvalue)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	// fmt.Println("BEGIN PRINTING")
	// fmt.Println("ID : " + strconv.Itoa(u.Id))
	// fmt.Println("Data : " + u.Data)
	// fmt.Println(u.Dumpvalue)
	// fmt.Println(user)
	checkArticle := Article_Table{ArticleID: u.Id}
	err = checkArticle.ReadShort()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusNotFound
		res.Data = "Article Check Error : " + err.Error()
		return c.JSON(http.StatusNotFound, res)
	}

	_, _, TrueUpdate, _, err := GetTruePermission(c, checkArticle.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err.Error()
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueUpdate || permission {
		updateArticle := Article_Table{
			ArticleID:      u.Id,
			OwnerID:        0,
			LastEditedByID: 0,
			LastEditedTime: time.Time{},
			Tag:            "",
			Title:          "",
			CategoryID:     0,
			Article:        u.Data,
			FileID:         "",
			DocID:          "",
			IsActive:       0,
		}
		err = updateArticle.UpdateArticleOnly()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		res.StatusCode = http.StatusOK
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO EDIT THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ReadArticleGrapesjs(c echo.Context) error {
	var err error
	var res Article_GrapesJS
	u := new(Article_GrapesJS)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	fmt.Println(u)
	fmt.Println(user)
	checkArticle := Article_Table{ArticleID: u.Id}
	err = checkArticle.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusNotFound
		res.Data = "Article Check Error : " + err.Error()
		return c.JSON(http.StatusNotFound, res)
	}
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, checkArticle.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err.Error()
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueRead || TrueUpdate || permission {
		tmp := checkArticle.Article
		tmp_divided := GrapesJS_Data{}
		err = json.Unmarshal([]byte(tmp), &tmp_divided)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		tmp, err = dependency.MapToJson(tmp_divided.Data)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		res.Data = tmp
		res.Id = checkArticle.ArticleID
		res.StatusCode = http.StatusOK
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO EDIT THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}
