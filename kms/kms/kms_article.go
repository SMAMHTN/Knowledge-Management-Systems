package kms

import (
	"dependency"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

type Article_Table struct {
	ArticleID      int `json:"ArticleID" query:"ArticleID"`
	OwnerID        int
	LastEditedByID int
	LastEditedTime time.Time
	Tag            string
	Title          string
	CategoryID     int
	Article        string
	FileID         string
	DocID          string
	IsActive       int
}

func ListArticle(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := Response{}
	if permission {
		DocList, _ := ReadArticle(query)
		res.StatusCode = http.StatusOK
		res.Data = DocList
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ShowArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ARTICLE NOT FOUND"
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
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	// err = permission_kms.Read()
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueRead || TrueUpdate || permission {
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO READ THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.Tag)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR Tag : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.FileID)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR FileID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.DocID)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR DocID : " + err.Error()
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
	TrueCreate, _, _, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueCreate || permission {
		_, err = u.Create()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = "CREATE ERROR : " + err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		// resulta, err := u.ConvForSolr()
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// err = resulta.PrepareSolrData(c)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// _, _, err = SolrCallUpdate("POST", resulta)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Article", "Added Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
		if err != nil {
			Logger.Error("failed to record article change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO CREATE ARTICLE IN THIS CATEGORY"
		return c.JSON(http.StatusForbidden, res)
	}
}

func EditArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.Tag)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR Tag : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.FileID)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR FileID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToIntArray(u.DocID)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR DocID : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	oriu := *u
	err = oriu.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ORIGINAL NOT FOUND"
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
	_, _, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueUpdate || permission {
		// resulta, err := u.ConvForSolr()
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// err = resulta.PrepareSolrData(c)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// _, _, err = SolrCallUpdate("POST", resulta)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		err = u.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Article", "Edited Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
		if err != nil {
			Logger.Error("failed to record article change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO EDIT THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_Table)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	oriu := u
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
	_, _, _, TrueDelete, err := GetTruePermission(c, u.CategoryID, role_id)
	// err = permission_kms.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueDelete || permission {
		err = u.Delete()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DELETE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		// err = DeleteSolrDocument(strconv.Itoa(u.ArticleID))
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "DELETE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Article", "Deleted Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
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

func QueryArticle(c echo.Context) error {
	var err error
	var res Response
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	q := c.QueryParam("q")
	search := c.QueryParam("search")
	query := c.QueryParam("query")
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	CategoryIDList, err := GetReadCategoryList(c, role_id)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	response, _, err := SolrCallQuery(CategoryIDList, q, query, search)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = string(response)
	return c.JSON(http.StatusOK, res)
}
