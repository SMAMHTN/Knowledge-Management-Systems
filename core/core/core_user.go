package core

import (
	"dependency"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type User_API struct {
	UserID       int    `json:"UserID" query:"UserID"`
	UserPhoto    string `json:"UserPhoto"`
	Username     string `json:"Username" query:"Username"`
	Password     string `json:"Password"`
	Name         string `json:"Name"`
	Email        string `json:"Email"`
	Address      string `json:"Address"`
	Phone        string `json:"Phone"`
	RoleID       int    `json:"RoleID"`
	RoleName     string `json:"RoleName"`
	AppthemeID   int    `json:"AppthemeID"`
	AppthemeName string `json:"AppthemeName"`
	Note         string `json:"Note"`
	IsSuperAdmin bool   `json:"IsSuperAdmin"`
	IsActive     bool   `json:"IsActive"`
}

func ListUser(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "core_user")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		listUser, _ := ReadUserWithoutPhoto(LimitQuery, ValuesQuery)
		var listUserAPI []User_API
		for _, y := range listUser {
			listUserAPI = append(listUserAPI, y.ToAPI())
		}
		res.StatusCode = http.StatusOK
		res.Data = listUserAPI
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ListUserID(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "core_user")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		listUser, _ := ReadUserIDWithoutPhoto(LimitQuery, ValuesQuery)
		res.StatusCode = http.StatusOK
		res.Data = listUser
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func LoginUser(c echo.Context) error {
	_, now_user, _ := Check_Permission_API(c)
	res := Response{}
	res.StatusCode = http.StatusOK
	res.Data = now_user.ToAPI()
	return c.JSON(http.StatusOK, res)
}

func ShowUser(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.UserID == now_user.UserID || u.UserID == 0 {
		u.UserID = now_user.UserID
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "USER NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		*u = uOri.ToAPI()
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "USER NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		*u = uOri.ToAPI()
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddUser(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		_, err = uOri.Create()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		uOri.Read()
		*u = uOri.ToAPI()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Added User : "+u.Name+"("+u.Username+")"+"("+strconv.Itoa(u.UserID)+")")
		if err != nil {
			Logger.Error(" failed to record user change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func EditUser(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.UserID == now_user.UserID || u.UserID == 0 {
		u.UserID = now_user.UserID
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		uOri.Read()
		*u = uOri.ToAPI()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Edited User : "+u.Name+"("+u.Username+")"+"("+strconv.Itoa(u.UserID)+")")
		if err != nil {
			Logger.Error(" failed to record user change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	}
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		uOri.Read()
		*u = uOri.ToAPI()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Edited User : "+u.Name+"("+u.Username+")"+"("+strconv.Itoa(u.UserID)+")")
		if err != nil {
			Logger.Error(" failed to record user change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteUser(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User_API)
	err = c.Bind(u)
	if u.UserID == 1 {
		res.StatusCode = http.StatusBadRequest
		res.Data = "You Cannot Delete this Role because this role constrain used by system"
		return c.JSON(http.StatusBadRequest, res)
	}
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Delete()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED USER " + strconv.Itoa(uOri.UserID)
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Deleted User : "+u.Name+"("+u.Username+")"+"("+strconv.Itoa(u.UserID)+")")
		if err != nil {
			Logger.Warn(err.Error())
			Logger.Error(" failed to record user change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func CheckUserExist(c echo.Context) error {
	var err error
	res := Response{}
	u := new(User_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	uOri, err := u.ToTable()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err
		return c.JSON(http.StatusBadRequest, res)
	}
	err = uOri.CheckExist()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusNotFound
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}

func (data User) ToAPI() (res User_API) {
	var err error
	UserApptheme := Theme{AppthemeID: data.AppthemeID}
	err = UserApptheme.Read()
	if err != nil {
		res.AppthemeName = ""
	} else {
		res.AppthemeName = UserApptheme.AppthemeName
	}
	UserRole := Role{RoleID: data.RoleID}
	err = UserRole.Read()
	if err != nil {
		res.RoleName = ""
	} else {
		res.RoleName = UserRole.RoleName
	}
	res.UserID = data.UserID
	res.UserPhoto = dependency.BytesToBase64(data.UserPhoto)
	res.Username = data.Username
	res.Password = data.Password
	res.Name = data.Name
	res.Email = data.Email
	res.Address = data.Address
	res.Phone = data.Phone
	res.RoleID = data.RoleID
	res.AppthemeID = data.AppthemeID
	res.Note = data.Note
	res.IsSuperAdmin = data.IsSuperAdmin == 1
	res.IsActive = data.IsActive == 1
	return res
}

func (data User_API) ToTable() (res User, err error) {
	res.UserID = data.UserID
	res.UserPhoto, err = dependency.Base64ToBytes(data.UserPhoto)
	res.Username = data.Username
	res.Password = data.Password
	res.Name = data.Name
	res.Email = data.Email
	res.Address = data.Address
	res.Phone = data.Phone
	res.RoleID = data.RoleID
	res.AppthemeID = data.AppthemeID
	res.Note = data.Note
	res.IsSuperAdmin = dependency.BooltoInt(data.IsSuperAdmin)
	res.IsActive = dependency.BooltoInt(data.IsActive)
	return res, err
}

func UserAnotherTable(Sort []dependency.SortType, Where []dependency.WhereType) (ResSort []dependency.SortType, ResWhere []dependency.WhereType, err error) {
	var sortroleposition int
	var sortrole []dependency.SortType
	var whererolefirstposition bool
	var whererole []dependency.WhereType
	var sortthemeposition int
	var sorttheme []dependency.SortType
	var wherethemefirstposition bool
	var wheretheme []dependency.WhereType
	for x, y := range Sort {
		switch y.Field {
		case "RoleName", "RoleDescription":
			if sortroleposition == 0 {
				sortroleposition = x + 1
			}
			sortrole = append(sortrole, y)
		case "AppthemeName":
			if sortthemeposition == 0 {
				sortthemeposition = x + 1
			}
			sorttheme = append(sorttheme, y)
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
		case "AppthemeName":
			if !wherethemefirstposition && a == 0 {
				wherethemefirstposition = true
			}
			wheretheme = append(wheretheme, b)
		default:
			ResWhere = append(ResWhere, b)
		}
	}
	if len(sortrole) > 0 || len(whererole) > 0 {
		tmpquery, tmpvalue, err := dependency.SortQueryMaker("", nil, sortrole, whererole)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		RoleIDs, err := ReadRoleID(tmpquery, tmpvalue)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortrole) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(RoleParentID," + dependency.ConvIntArrayToString(RoleIDs) + ")",
				Ascending: sortrole[0].Ascending,
			}
			ResSort = append(ResSort[:sortroleposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortroleposition-1:]...)...)
		}
		if len(whererole) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "RoleParentID",
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
	if len(sorttheme) > 0 || len(wheretheme) > 0 {
		tmpquery, tmpvalue, err := dependency.SortQueryMaker("", nil, sorttheme, wheretheme)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		ThemeIDs, err := ReadThemeID(tmpquery, tmpvalue)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sorttheme) > 0 {
			ConvertedSort2 := dependency.SortType{
				Field:     "FIELD(AppthemeID," + dependency.ConvIntArrayToString(ThemeIDs) + ")",
				Ascending: sorttheme[0].Ascending,
			}
			ResSort = append(ResSort[:sortthemeposition-1], append([]dependency.SortType{ConvertedSort2}, ResSort[sortthemeposition-1:]...)...)
		}
		if len(wheretheme) > 0 {
			ConvertedWhere2 := dependency.WhereType{
				Field:    "AppthemeID",
				Operator: wheretheme[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(ThemeIDs),
			}
			if wherethemefirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere2}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere2)
			}
		}
	}
	return ResSort, ResWhere, nil
}
