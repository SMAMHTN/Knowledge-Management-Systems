package kms

import (
	"dependency"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"

	"github.com/labstack/echo/v4"
)

func ListDoc(c echo.Context) error {

	permission, _, _ := Check_Admin_Permission_API(c)
	res := ResponseList{}
	limit := new(dependency.QueryType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		var LimitQuery string
		var ValuesQuery []interface{}
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "kms_doc")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		DocList, _ := ReadDoc(LimitQuery, ValuesQuery)
		res.StatusCode = http.StatusOK
		res.Data = DocList
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ListDocID(c echo.Context) error {

	permission, _, _ := Check_Admin_Permission_API(c)
	res := ResponseList{}
	limit := new(dependency.QueryType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		var LimitQuery string
		var ValuesQuery []interface{}
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "kms_doc")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		DocList, _ := ReadDocID(LimitQuery, ValuesQuery)
		res.StatusCode = http.StatusOK
		res.Data = DocList
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ShowDoc(c echo.Context) error {
	var err error
	var res Response
	u := new(Doc)
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
		res.Data = "DOC NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	permission, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	if TrueRead || TrueUpdate || permission {
		return c.Attachment(u.DocLoc, path.Base(u.DocLoc))
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO DELETE THIS DOCUMENT"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddDoc(c echo.Context) error {
	// Read form fields
	res := Response{}
	var AllowedFileType []string
	category_id_pure := c.FormValue("CategoryID")
	if category_id_pure == "" {
		res.StatusCode = http.StatusBadRequest
		res.Data = "CategoryID is empty"
		return c.JSON(http.StatusBadRequest, res)
	}
	category_id64, err := strconv.ParseInt(category_id_pure, 10, 0)
	category_id := int(category_id64)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	permission, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	TrueCreate, _, _, _, err := GetTruePermission(c, category_id, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	if !TrueCreate {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD IN THIS CATEGORY"
		return c.JSON(http.StatusForbidden, res)
	}
	AllowedFileType, err = GetAllDocTypePermission(c, category_id, role_id)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	file, err := c.FormFile("File")
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	src, err := file.Open()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	defer src.Close()
	filepath := Conf.Filestore + "doc/" + file.Filename
	filepathext := path.Ext(filepath)[1:]
	if dependency.CheckValueExistString(AllowedFileType, "-"+filepathext) {
		res.StatusCode = http.StatusUnauthorized
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD THIS TYPE OF DOCUMENT"
		return c.JSON(http.StatusUnauthorized, res)
	} else if dependency.CheckValueExistString(AllowedFileType, "*") || dependency.CheckValueExistString(AllowedFileType, filepathext) || permission {
		dst, filepath, err := dependency.CreateEmptyFileDuplicate(filepath)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		DBDoc := Doc{
			DocID:      0,
			DocLoc:     filepath,
			CategoryID: category_id,
			DocType:    filepathext,
		}

		_, err = DBDoc.Create()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.StatusCode = http.StatusOK
		res.Data = DBDoc
		err = RecordHistory(c, "Doc", "Added Doc : "+DBDoc.DocLoc+"("+strconv.Itoa(DBDoc.DocID)+")")
		if err != nil {
			Logger.Error("failed to record doc change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusUnauthorized
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD THIS TYPE OF DOCUMENT"
		return c.JSON(http.StatusUnauthorized, res)
	}
}

func DeleteDoc(c echo.Context) error {
	res := Response{}
	var err error
	u := new(Doc)
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
		res.Data = "DOC NOT FOUND ON DATABASE"
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
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	if !TrueDelete {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO DELETE THIS DOCUMENT"
		return c.JSON(http.StatusForbidden, res)
	}
	err = os.Remove(u.DocLoc)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	err = u.Delete()
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = "DELETED DOCUMENT"
	err = RecordHistory(c, "Doc", "Deleted Doc : "+u.DocLoc+"("+strconv.Itoa(u.DocID)+")")
	if err != nil {
		Logger.Error("failed to record doc change history " + err.Error())
	}
	return c.JSON(http.StatusOK, res)
}
