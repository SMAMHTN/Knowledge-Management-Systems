package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"golang.org/x/exp/slices"
)

type Permission struct {
	PermissionID int
	CategoryID   int
	RoleID       int
	PCreate      int    `json:"Create"`
	PRead        int    `json:"Read"`
	PUpdate      int    `json:"Update"`
	PDelete      int    `json:"Delete"`
	FileType     string //json
	DocType      string //json
}

func ReadPermission(args string) ([]Permission, error) {
	var results []Permission
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []Permission{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_permission" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_permission")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Permission{}
		var err = sqlresult.Scan(&result.PermissionID, &result.CategoryID, &result.RoleID, &result.PCreate, &result.PRead, &result.PUpdate, &result.PDelete, &result.FileType, &result.DocType)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Permission) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_permission(CategoryID, RoleID, `Create`, `Read`, `Update`, `Delete`, `FileType`, `DocType`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.CategoryID, data.RoleID, data.PCreate, data.PRead, data.PUpdate, data.PDelete, data.FileType, data.DocType)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.PermissionID = int(lastid)
	return int(lastid), nil
}

func (data *Permission) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.PermissionID != 0 {
		err = database.QueryRow("SELECT * FROM kms_permission WHERE PermissionID = ?", data.PermissionID).Scan(&data.PermissionID, &data.CategoryID, &data.RoleID, &data.PCreate, &data.PRead, &data.PUpdate, &data.PDelete, &data.FileType, &data.DocType)
	} else if data.CategoryID != 0 && data.RoleID != 0 {
		err = database.QueryRow("SELECT * FROM kms_permission WHERE CategoryID = ? AND RoleID = ?", data.CategoryID, data.RoleID).Scan(&data.PermissionID, &data.CategoryID, &data.RoleID, &data.PCreate, &data.PRead, &data.PUpdate, &data.PDelete, &data.FileType, &data.DocType)
	} else {
		return errors.New("please insert permissionid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Permission) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_permission SET CategoryID=?, RoleID=?, `Create`=?, `Read`=?, `Update`=?, `Delete`=?, `FileType`=?, `DocType`=? WHERE PermissionID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.CategoryID, data.RoleID, data.PCreate, data.PRead, data.PUpdate, data.PDelete, data.FileType, data.DocType, data.PermissionID)
	if err != nil {
		return err
	}
	return nil
}

func (data Permission) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_permission WHERE `PermissionID`=?")
	if err != nil {
		return err
	}
	if data.PermissionID != 0 {
		_, err = del.Exec(data.PermissionID)
	} else {
		return errors.New("permissionid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func ListPermission(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := Response{}
	if permission {
		listCategory, _ := ReadPermission(query)
		res.StatusCode = http.StatusOK
		res.Data = listCategory
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ShowPermission(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Permission)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Read()
		if err != nil {
			res.StatusCode = http.StatusNotFound
			res.Data = "KMS PERMISSION NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddPermission(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Permission)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.FileType)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR FileType : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.DocType)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR DocType : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		bool, _ := Check_Role_Exist(c, u.RoleID)
		if !bool {
			res.StatusCode = http.StatusConflict
			res.Data = "RoleID Not Found"
			return c.JSON(http.StatusConflict, res)
		}
		_, err = u.Create()
		if err != nil {
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func EditPermission(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Permission)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.FileType)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR FileType : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, err = dependency.ConvStringToStringArray(u.DocType)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR DocType : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		bool, _ := Check_Role_Exist(c, u.RoleID)
		if !bool {
			res.StatusCode = http.StatusConflict
			res.Data = "RoleID Not Found"
			return c.JSON(http.StatusConflict, res)
		}
		err = u.Update()
		if err != nil {
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeletePermission(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Permission)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Delete()
		if err != nil {
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED KMS PERMISSION " + strconv.Itoa(u.PermissionID)
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func GetTruePermission(c echo.Context, CategoryID int, RoleID int) (Create bool, Read bool, Update bool, Delete bool, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	Create = false
	Read = false
	Update = false
	Delete = false
	err = nil
	cred := strings.Split(userpass, "&&")
	SendData := map[string]interface{}{"RoleID": RoleID}
	RoleIDListPure, err := CallCoreAPIPure("GET", "listrolechild", SendData, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return Create, Read, Update, Delete, err
	}
	RoleIDListInterface, isexist := RoleIDListPure["Data"].([]interface{})
	if !isexist {
		return Create, Read, Update, Delete, err
	}

	RoleIDList, err := dependency.SliceInterfaceToInt(RoleIDListInterface)
	if err != nil {
		return Create, Read, Update, Delete, err
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	CategoryIDData := Category{
		CategoryID: CategoryID,
	}
	CategoryIDList, err := CategoryIDData.ListAllCategoryParent()
	if err != nil {
		return Create, Read, Update, Delete, err
	}

	var categoryIDListString string
	categoryIDListString = fmt.Sprintf("%d", CategoryIDList[0])
	for i := 1; i < len(CategoryIDList); i++ {
		categoryIDListString += fmt.Sprintf(", %d", CategoryIDList[i])
	}
	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s) AND CategoryID IN (%s)", roleIDListString, categoryIDListString)
	PermissionList, err := ReadPermission(FinalQuery)
	for _, val := range PermissionList {
		if !Create {
			if val.PCreate != 0 {
				Create = true
			}
		}
		if !Read {
			if val.PRead != 0 {
				Read = true
			}
		}
		if !Update {
			if val.PUpdate != 0 {
				Update = true
			}
		}
		if !Delete {
			if val.PDelete != 0 {
				Delete = true
			}
		}
	}
	return Create, Read, Update, Delete, err
}

func GetAllFileTypePermission(c echo.Context, CategoryID int, RoleID int) (FileTypeList []string, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	err = nil
	cred := strings.Split(userpass, "&&")
	SendData := map[string]interface{}{"RoleID": RoleID}
	RoleIDListPure, err := CallCoreAPIPure("GET", "listrolechild", SendData, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return nil, err
	}
	RoleIDListInterface, isexist := RoleIDListPure["Data"].([]interface{})
	if !isexist {
		return nil, err
	}

	RoleIDList, err := dependency.SliceInterfaceToInt(RoleIDListInterface)
	if err != nil {
		return nil, err
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	CategoryIDData := Category{
		CategoryID: CategoryID,
	}
	CategoryIDList, err := CategoryIDData.ListAllCategoryParent()
	if err != nil {
		return nil, err
	}

	var categoryIDListString string
	categoryIDListString = fmt.Sprintf("%d", CategoryIDList[0])
	for i := 1; i < len(CategoryIDList); i++ {
		categoryIDListString += fmt.Sprintf(", %d", CategoryIDList[i])
	}
	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s) AND CategoryID IN (%s)", roleIDListString, categoryIDListString)
	PermissionList, err := ReadPermission(FinalQuery)
	for _, val := range PermissionList {
		TmpFileTypeList, err := dependency.ConvStringToStringArrayUnique(val.FileType)
		if err != nil {
			return nil, err
		}
		FileTypeList = append(FileTypeList, TmpFileTypeList...)
	}
	return FileTypeList, err
}

func GetAllDocTypePermission(c echo.Context, CategoryID int, RoleID int) (DocTypeList []string, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	err = nil
	cred := strings.Split(userpass, "&&")
	SendData := map[string]interface{}{"RoleID": RoleID}
	RoleIDListPure, err := CallCoreAPIPure("GET", "listrolechild", SendData, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return nil, err
	}
	RoleIDListInterface, isexist := RoleIDListPure["Data"].([]interface{})
	if !isexist {
		return nil, err
	}

	RoleIDList, err := dependency.SliceInterfaceToInt(RoleIDListInterface)
	if err != nil {
		return nil, err
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	CategoryIDData := Category{
		CategoryID: CategoryID,
	}
	CategoryIDList, err := CategoryIDData.ListAllCategoryParent()
	if err != nil {
		return nil, err
	}

	var categoryIDListString string
	categoryIDListString = fmt.Sprintf("%d", CategoryIDList[0])
	for i := 1; i < len(CategoryIDList); i++ {
		categoryIDListString += fmt.Sprintf(", %d", CategoryIDList[i])
	}
	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s) AND CategoryID IN (%s)", roleIDListString, categoryIDListString)
	PermissionList, err := ReadPermission(FinalQuery)
	for _, val := range PermissionList {
		TmpDocTypeList, err := dependency.ConvStringToStringArrayUnique(val.DocType)
		if err != nil {
			return nil, err
		}
		DocTypeList = append(DocTypeList, TmpDocTypeList...)
	}
	return DocTypeList, err
}

func GetReadCategoryList(c echo.Context, RoleID int) (CategoryIDList []int, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	err = nil
	cred := strings.Split(userpass, "&&")
	SendData := map[string]interface{}{"RoleID": RoleID}
	RoleIDListPure, err := CallCoreAPIPure("GET", "listrolechild", SendData, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return CategoryIDList, err
	}
	RoleIDListInterface, isexist := RoleIDListPure["Data"].([]interface{})
	if !isexist {
		return CategoryIDList, err
	}

	RoleIDList, err := dependency.SliceInterfaceToInt(RoleIDListInterface)
	if err != nil {
		return CategoryIDList, err
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s)", roleIDListString)
	PermissionList, err := ReadPermission(FinalQuery)
	if err != nil {
		return CategoryIDList, err
	}
	for _, val := range PermissionList {
		if val.PRead != 0 {
			if !slices.Contains(CategoryIDList, val.CategoryID) {
				CategoryTMP := Category{CategoryID: val.CategoryID}
				CategoryParentTMP, err := CategoryTMP.ListAllCategoryChild()
				if err != nil {
					return CategoryIDList, err
				}
				CategoryIDList = append(CategoryIDList, CategoryParentTMP...)
			}
		}
	}
	return CategoryIDList, nil
}
