package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Doc struct {
	DocID      int `json:"DocID" query:"DocID"`
	DocLoc     string
	CategoryID int
	DocType    string
}

func ReadDoc(args string) ([]Doc, error) {
	var results []Doc
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return []Doc{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_doc" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_doc")
	}

	if err != nil {
		log.Println("WARNING " + err.Error())
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Doc{}
		var err = sqlresult.Scan(&result.DocID, &result.DocLoc, &result.CategoryID, &result.DocType)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Doc) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_doc(DocLoc, CategoryID, DocType) VALUES(?, ?, ?)")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.DocLoc, data.CategoryID, data.DocType)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.DocID = int(lastid)
	return int(lastid), nil
}

func (data *Doc) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	if data.DocID != 0 {
		err = database.QueryRow("SELECT * FROM kms_doc WHERE DocID = ?", data.DocID).Scan(&data.DocID, &data.DocLoc, &data.CategoryID, &data.DocType)
	} else if data.DocLoc != "" {
		err = database.QueryRow("SELECT * FROM kms_doc WHERE DocLoc = ?", data.DocLoc).Scan(&data.DocID, &data.DocLoc, &data.CategoryID, &data.DocType)
	} else {
		return errors.New("please insert docid or docloc")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Doc) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_doc SET DocLoc=?, CategoryID=?, DocType=? WHERE DocID=?;")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.DocLoc, data.CategoryID, data.DocType, data.DocID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Doc) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_doc WHERE `DocID`=?")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	if data.DocID != 0 {
		_, err = del.Exec(data.DocID)
	} else {
		return errors.New("docid needed")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	return nil
}

func UploadDoc(c echo.Context) error {
	res := Response{}
	file, err := c.FormFile("data")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	src, err := file.Open()
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(file.Filename)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	res.StatusCode = http.StatusOK
	return c.JSON(http.StatusOK, res)
}

func ListDoc(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := Response{}
	if permission {
		DocList, _ := ReadDoc(query)
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DOC NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	permission, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	permission, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	TrueCreate, _, _, _, err := GetTruePermission(c, category_id, role_id)
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	file, err := c.FormFile("File")
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	src, err := file.Open()
	if err != nil {
		log.Println("WARNING " + err.Error())
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
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			log.Println("WARNING " + err.Error())
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
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.StatusCode = http.StatusOK
		res.Data = DBDoc
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.Read()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DOC NOT FOUND ON DATABASE"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, _, _, TrueDelete, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	err = u.Delete()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err.Error()
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = "DELETED DOCUMENT"
	return c.JSON(http.StatusOK, res)
}
