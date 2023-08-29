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

func ListFile(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := ResponseList{}
	limit := new(dependency.LimitType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		var LimitQuery string
		TotalRow, err := CountRows("kms_file")
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		LimitQuery, res.Info = limit.LimitMaker(TotalRow)
		FileList, _ := ReadFile(query + " " + LimitQuery)
		res.StatusCode = http.StatusOK
		res.Data = FileList
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ShowFile(c echo.Context) error {
	var err error
	var res Response
	u := new(File)
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
		res.Data = "FILE NOT FOUND"
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
		return c.Attachment(u.FileLoc, path.Base(u.FileLoc))
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO DELETE THIS FILE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddFile(c echo.Context) error {
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
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD IN THIS CATEGORY"
		return c.JSON(http.StatusForbidden, res)
	}
	if !TrueCreate {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD IN THIS CATEGORY"
		return c.JSON(http.StatusForbidden, res)
	}
	AllowedFileType, err = GetAllFileTypePermission(c, category_id, role_id)
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
	filepath := Conf.Filestore + "file/" + file.Filename
	filepathext := path.Ext(filepath)[1:]
	if dependency.CheckValueExistString(AllowedFileType, "-"+filepathext) {
		res.StatusCode = http.StatusUnauthorized
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD THIS TYPE OF FILE"
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

		DBFile := File{
			FileID:     0,
			FileLoc:    filepath,
			CategoryID: category_id,
			FileType:   filepathext,
		}

		_, err = DBFile.Create()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.StatusCode = http.StatusOK
		res.Data = DBFile
		err = RecordHistory(c, "File", "Added File : "+DBFile.FileLoc+"("+strconv.Itoa(DBFile.FileID)+")")
		if err != nil {
			Logger.Error("failed to record File change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusUnauthorized
		res.Data = "YOU DONT HAVE PERMISSION TO UPLOAD THIS TYPE OF DOCUMENT"
		return c.JSON(http.StatusUnauthorized, res)
	}
}

func DeleteFile(c echo.Context) error {
	res := Response{}
	var err error
	u := new(File)
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
		res.Data = "FILE NOT FOUND ON DATABASE"
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
	err = os.Remove(u.FileLoc)
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
	res.Data = "DELETED FILE"
	err = RecordHistory(c, "File", "Deleted File : "+u.FileLoc+"("+strconv.Itoa(u.FileID)+")")
	if err != nil {
		Logger.Error("failed to record File change history " + err.Error())
	}
	return c.JSON(http.StatusOK, res)
}
