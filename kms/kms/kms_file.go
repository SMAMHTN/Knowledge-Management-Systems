package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"

	"github.com/labstack/echo/v4"
)

type File struct {
	FileID     int
	FileLoc    string
	CategoryID int
	FileType   string
}

func ReadFile(args string) ([]File, error) {
	var results []File
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []File{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_file" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_file")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = File{}
		var err = sqlresult.Scan(&result.FileID, &result.FileLoc, &result.CategoryID, &result.FileType)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *File) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_file(FileLoc, CategoryID, FileType) VALUES(?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.FileLoc, data.CategoryID, data.FileType)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.FileID = int(lastid)
	return int(lastid), nil
}

func (data *File) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.FileID != 0 {
		err = database.QueryRow("SELECT * FROM kms_file WHERE FileID = ?", data.FileID).Scan(&data.FileID, &data.FileLoc, &data.CategoryID, &data.FileType)
	} else if data.FileLoc != "" {
		err = database.QueryRow("SELECT * FROM kms_file WHERE FileLoc = ?", data.FileLoc).Scan(&data.FileID, &data.FileLoc, &data.CategoryID, &data.FileType)
	} else {
		return errors.New("please insert fileid or fileloc")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data File) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_file SET FileLoc=?, CategoryID=?, FileType=? WHERE FileID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.FileLoc, data.CategoryID, data.FileType, data.FileID)
	if err != nil {
		return err
	}
	return nil
}

func (data File) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_file WHERE `FileID`=?")
	if err != nil {
		return err
	}
	if data.FileID != 0 {
		_, err = del.Exec(data.FileID)
	} else {
		return errors.New("fileid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func ListFile(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := Response{}
	if permission {
		FileList, _ := ReadFile(query)
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
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "FILE NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	if TrueRead || TrueUpdate {
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
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	TrueCreate, _, _, _, err := GetTruePermission(c, category_id, role_id)
	if err != nil {
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
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	file, err := c.FormFile("File")
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	src, err := file.Open()
	if err != nil {
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
	} else if dependency.CheckValueExistString(AllowedFileType, "*") || dependency.CheckValueExistString(AllowedFileType, filepathext) {
		dst, filepath, err := dependency.CreateEmptyFileDuplicate(filepath)
		if err != nil {
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
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
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.StatusCode = http.StatusOK
		res.Data = DBFile
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
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "FILE NOT FOUND ON DATABASE"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, _, _, TrueDelete, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
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
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	err = u.Delete()
	if err != nil {
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = "DELETED FILE"
	return c.JSON(http.StatusOK, res)
}
