package kms

import (
	"dependency"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"golang.org/x/exp/slices"
)

type Permission_API struct {
	PermissionID int `json:"PermissionID" query:"PermissionID"`
	CategoryID   int
	CategoryName string
	RoleID       int
	RoleName     string
	PCreate      bool `json:"Create"`
	PRead        bool `json:"Read"`
	PUpdate      bool `json:"Update"`
	PDelete      bool `json:"Delete"`
	FileType     []string
	DocType      []string
}

func ListPermission(c echo.Context) error {
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, PermissionAnotherTable, c, Database, "kms_permission")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		ListPermission, _ := ReadPermission(LimitQuery, ValuesQuery)
		var ListPermissionAPI []Permission_API
		for _, x := range ListPermission {
			tmp, err := x.ToAPI(c)
			if err != nil {
				Logger.Error(err.Error())
				res.StatusCode = http.StatusInternalServerError
				res.Data = err
				return c.JSON(http.StatusInternalServerError, res)
			}
			ListPermissionAPI = append(ListPermissionAPI, tmp)
		}
		res.StatusCode = http.StatusOK
		res.Data = ListPermissionAPI
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ListPermissionID(c echo.Context) error {
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, PermissionAnotherTable, c, Database, "kms_permission")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		ListPermission, _ := ReadPermissionID(LimitQuery, ValuesQuery)
		res.StatusCode = http.StatusOK
		res.Data = ListPermission
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
	u := new(Permission_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "KMS PERMISSION NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		*u, err = uOri.ToAPI(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = *u
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
	u := new(Permission_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		bool, _ := Check_Role_Exist(c, u.RoleID)
		if !bool {
			res.StatusCode = http.StatusConflict
			res.Data = "RoleID Not Found"
			return c.JSON(http.StatusConflict, res)
		}
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		_, err = uOri.Create()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		*u, err = uOri.ToAPI(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = *u
		err = RecordHistory(c, "Permission", "Added Permission : ("+strconv.Itoa(u.PermissionID)+")")
		if err != nil {
			Logger.Error("failed to record permission change history " + err.Error())
		}
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
	u := new(Permission_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		bool, _ := Check_Role_Exist(c, u.RoleID)
		if !bool {
			res.StatusCode = http.StatusConflict
			res.Data = "RoleID Not Found"
			return c.JSON(http.StatusConflict, res)
		}
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		err = uOri.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		*u, err = uOri.ToAPI(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = *u
		err = RecordHistory(c, "Permission", "Edited Permission : ("+strconv.Itoa(u.PermissionID)+")")
		if err != nil {
			Logger.Error("failed to record permission change history " + err.Error())
		}
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
	u := new(Permission_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		err = uOri.Delete()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED KMS PERMISSION " + strconv.Itoa(u.PermissionID)
		err = RecordHistory(c, "Permission", "Deleted Permission : ("+strconv.Itoa(u.PermissionID)+")")
		if err != nil {
			Logger.Error("failed to record permission change history " + err.Error())
		}
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

	if len(RoleIDList) == 0 {
		return Create, Read, Update, Delete, errors.New("permission not found")
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	CategoryIDData := Category{
		CategoryID: CategoryID,
	}
	CategoryIDList, err := CategoryIDData.ListAllCategoryChild()
	if err != nil {
		return Create, Read, Update, Delete, err
	}

	if len(CategoryIDList) == 0 {
		return Create, Read, Update, Delete, errors.New("permission not found")
	}

	var categoryIDListString string
	categoryIDListString = fmt.Sprintf("%d", CategoryIDList[0])
	for i := 1; i < len(CategoryIDList); i++ {
		categoryIDListString += fmt.Sprintf(", %d", CategoryIDList[i])
	}
	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s) AND CategoryID IN (%s)", roleIDListString, categoryIDListString)
	PermissionList, err := ReadPermission(FinalQuery, nil)
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
	for _, singcat := range CategoryIDList {
		if singcat == 1 {
			Read = true
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
	CategoryIDList, err := CategoryIDData.ListAllCategoryChild()
	if err != nil {
		return nil, err
	}

	var categoryIDListString string
	categoryIDListString = fmt.Sprintf("%d", CategoryIDList[0])
	for i := 1; i < len(CategoryIDList); i++ {
		categoryIDListString += fmt.Sprintf(", %d", CategoryIDList[i])
	}
	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s) AND CategoryID IN (%s)", roleIDListString, categoryIDListString)
	PermissionList, err := ReadPermission(FinalQuery, nil)
	for _, val := range PermissionList {
		TmpFileTypeList := dependency.ConvStringToStringArray(val.FileType)
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
	CategoryIDList, err := CategoryIDData.ListAllCategoryChild()
	if err != nil {
		return nil, err
	}

	var categoryIDListString string
	categoryIDListString = fmt.Sprintf("%d", CategoryIDList[0])
	for i := 1; i < len(CategoryIDList); i++ {
		categoryIDListString += fmt.Sprintf(", %d", CategoryIDList[i])
	}
	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s) AND CategoryID IN (%s)", roleIDListString, categoryIDListString)
	PermissionList, err := ReadPermission(FinalQuery, nil)
	for _, val := range PermissionList {
		TmpDocTypeList := dependency.ConvStringToStringArray(val.DocType)
		if err != nil {
			return nil, err
		}
		DocTypeList = append(DocTypeList, TmpDocTypeList...)
	}
	return DocTypeList, err
}

func GetCurrentUserReadCategoryList(c echo.Context) (CategoryIDList []int, err error) {
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		return CategoryIDList, err
	}
	CategoryIDList, err = GetReadCategoryList(c, role_id)
	if err != nil {
		return CategoryIDList, err
	}
	return CategoryIDList, nil
}

func GetAnyCreateUpdateDeletePermission(c echo.Context, RoleID int) (HaveCUDAccess bool, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	err = nil
	cred := strings.Split(userpass, "&&")
	SendData := map[string]interface{}{"RoleID": RoleID}
	RoleIDListPure, err := CallCoreAPIPure("GET", "listrolechild", SendData, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return HaveCUDAccess, err
	}
	RoleIDListInterface, isexist := RoleIDListPure["Data"].([]interface{})
	if !isexist {
		return HaveCUDAccess, err
	}

	RoleIDList, err := dependency.SliceInterfaceToInt(RoleIDListInterface)
	if err != nil {
		return HaveCUDAccess, err
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s)", roleIDListString)
	PermissionList, err := ReadPermission(FinalQuery, nil)
	if err != nil {
		return HaveCUDAccess, err
	}
	for _, val := range PermissionList {
		if val.PCreate != 0 || val.PUpdate != 0 || val.PDelete != 0 {
			return true, nil
		}
	}
	return false, nil
}

func GetAnyCUDPermission(c echo.Context) (AnyCUDPermission bool, err error) {
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		return AnyCUDPermission, err
	}
	AnyCUDPermission, err = GetAnyCreateUpdateDeletePermission(c, role_id)
	if err != nil {
		return AnyCUDPermission, err
	}
	return AnyCUDPermission, nil
}

func GetAnyCUDPermissionAPI(c echo.Context) error {
	var err error
	res := Response{}
	AnyCUDPermission, err := GetAnyCUDPermission(c)
	if err != nil {
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
	}
	res.StatusCode = http.StatusOK
	res.Data = AnyCUDPermission
	return c.JSON(http.StatusOK, res)
}

func GetAnyCreatePermission(c echo.Context, RoleID int) (HaveCUDAccess bool, err error) {
	_, userpass, _ := c.Request().BasicAuth()
	err = nil
	cred := strings.Split(userpass, "&&")
	SendData := map[string]interface{}{"RoleID": RoleID}
	RoleIDListPure, err := CallCoreAPIPure("GET", "listrolechild", SendData, dependency.GetElementString(cred, 0), dependency.GetElementString(cred, 1))
	if err != nil {
		return HaveCUDAccess, err
	}
	RoleIDListInterface, isexist := RoleIDListPure["Data"].([]interface{})
	if !isexist {
		return HaveCUDAccess, err
	}

	RoleIDList, err := dependency.SliceInterfaceToInt(RoleIDListInterface)
	if err != nil {
		return HaveCUDAccess, err
	}

	var roleIDListString string
	roleIDListString = fmt.Sprintf("%d", RoleIDList[0])
	for i := 1; i < len(RoleIDList); i++ {
		roleIDListString += fmt.Sprintf(", %d", RoleIDList[i])
	}

	FinalQuery := fmt.Sprintf("WHERE RoleID IN (%s)", roleIDListString)
	PermissionList, err := ReadPermission(FinalQuery, nil)
	if err != nil {
		return HaveCUDAccess, err
	}
	for _, val := range PermissionList {
		if val.PCreate != 0 {
			return true, nil
		}
	}
	return false, nil
}

func GetAnyCPermission(c echo.Context) (AnyCPermission bool, err error) {
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		return AnyCPermission, err
	}
	AnyCPermission, err = GetAnyCreatePermission(c, role_id)
	if err != nil {
		return AnyCPermission, err
	}
	return AnyCPermission, nil
}

func GetAnyCPermissionAPI(c echo.Context) error {
	var err error
	res := Response{}
	AnyCPermission, err := GetAnyCPermission(c)
	if err != nil {
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
	}
	res.StatusCode = http.StatusOK
	res.Data = AnyCPermission
	return c.JSON(http.StatusOK, res)
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
	PermissionList, err := ReadPermission(FinalQuery, nil)
	if err != nil {
		return CategoryIDList, err
	}
	for _, val := range PermissionList {
		if val.PRead != 0 {
			if !slices.Contains(CategoryIDList, val.CategoryID) {
				CategoryTMP := Category{CategoryID: val.CategoryID}
				CategoryChildTMP, err := CategoryTMP.ListAllCategoryChild()
				if err != nil {
					return CategoryIDList, err
				}
				CategoryIDList = append(CategoryIDList, CategoryChildTMP...)
			}
		}
	}
	if !slices.Contains(CategoryIDList, 1) {
		CategoryTMP := Category{CategoryID: 1}
		CategoryChildTMP, err := CategoryTMP.ListAllCategoryChild()
		if err != nil {
			return CategoryIDList, err
		}
		CategoryIDList = append(CategoryIDList, CategoryChildTMP...)
	}
	return CategoryIDList, nil
}

func (data Permission) ToAPI(c echo.Context) (res Permission_API, err error) {
	res = Permission_API{
		PermissionID: data.PermissionID,
		CategoryID:   data.CategoryID,
		RoleID:       data.RoleID,
		PCreate:      data.PCreate == 1,
		PRead:        data.PRead == 1,
		PUpdate:      data.PUpdate == 1,
		PDelete:      data.PDelete == 1,
		FileType:     []string{},
		DocType:      []string{},
	}
	res.FileType = dependency.ConvStringToStringArray(data.FileType)
	res.DocType = dependency.ConvStringToStringArray(data.DocType)
	PermissionCategory := Category{CategoryID: data.CategoryID}
	err = PermissionCategory.Read()
	if err == nil {
		res.CategoryName = PermissionCategory.CategoryName
	}
	Role, err := GetRole(c, data.RoleID)
	if err == nil {
		res.RoleName = Role.RoleName
	}
	return res, nil
}

func (data Permission_API) ToTable() (res Permission, err error) {
	res = Permission{
		PermissionID: data.PermissionID,
		CategoryID:   data.CategoryID,
		RoleID:       data.RoleID,
		PCreate:      dependency.BooltoInt(data.PCreate),
		PRead:        dependency.BooltoInt(data.PRead),
		PUpdate:      dependency.BooltoInt(data.PUpdate),
		PDelete:      dependency.BooltoInt(data.PDelete),
		FileType:     "",
		DocType:      "",
	}
	res.FileType, err = dependency.ConvStringArrayToString(data.FileType)
	if err != nil {
		return res, err
	}
	res.DocType, err = dependency.ConvStringArrayToString(data.DocType)
	return res, err
}

func PermissionAnotherTable(c echo.Context, Sort []dependency.SortType, Where []dependency.WhereType) (ResSort []dependency.SortType, ResWhere []dependency.WhereType, err error) {
	var sortroleposition int
	var sortrole []dependency.SortType
	var whererolefirstposition bool
	var whererole []dependency.WhereType
	var sortcategoryposition int
	var sortcategory []dependency.SortType
	var wherecategoryfirstposition bool
	var wherecategory []dependency.WhereType
	for x, y := range Sort {
		switch y.Field {
		case "RoleName", "RoleDescription":
			if sortroleposition == 0 {
				sortroleposition = x + 1
			}
			sortrole = append(sortrole, y)
		case "CategoryName", "CategoryDescription":
			if sortcategoryposition == 0 {
				sortcategoryposition = x + 1
			}
			sortcategory = append(sortcategory, y)
		default:
			ResSort = append(ResSort, y)
		}
	}
	for a, b := range Where {
		switch b.Field {
		case "RoleName", "RoleDescription":
			if !whererolefirstposition && a == 0 {
				whererolefirstposition = true
			}
			whererole = append(whererole, b)
		case "CategoryName", "CategoryDescription":
			if !wherecategoryfirstposition && a == 0 {
				wherecategoryfirstposition = true
			}
			wherecategory = append(wherecategory, b)
		default:
			ResWhere = append(ResWhere, b)
		}
	}
	if len(sortrole) > 0 || len(whererole) > 0 {
		RoleIDs, err := GetCoreIDs(c, "listroleid", sortrole, whererole)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortrole) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(RoleID," + dependency.ConvIntArrayToString(RoleIDs) + ")",
				Ascending: sortrole[0].Ascending,
			}
			ResSort = append(ResSort[:sortroleposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortroleposition-1:]...)...)
		}
		if len(whererole) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "RoleID",
				Operator: whererole[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(RoleIDs),
			}
			if whererolefirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere)
			}
		}
	}
	if len(sortcategory) > 0 || len(wherecategory) > 0 {
		tmpquery, tmpvalue, err := dependency.SortQueryMaker("", nil, sortcategory, wherecategory)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		CategoryIDs, err := ReadCategoryID(tmpquery, tmpvalue)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortcategory) > 0 {
			ConvertedSort2 := dependency.SortType{
				Field:     "FIELD(CategoryID," + dependency.ConvIntArrayToString(CategoryIDs) + ")",
				Ascending: sortcategory[0].Ascending,
			}
			ResSort = append(ResSort[:sortcategoryposition-1], append([]dependency.SortType{ConvertedSort2}, ResSort[sortcategoryposition-1:]...)...)
		}
		if len(wherecategory) > 0 {
			ConvertedWhere2 := dependency.WhereType{
				Field:    "CategoryID",
				Operator: wherecategory[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(CategoryIDs),
			}
			if wherecategoryfirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere2}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere2)
			}
		}
	}
	return ResSort, ResWhere, nil
}
