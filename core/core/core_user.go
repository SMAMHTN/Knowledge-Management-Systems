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
	AppthemeID   int    `json:"AppthemeID"`
	Note         string `json:"Note"`
	IsSuperAdmin bool   `json:"IsSuperAdmin"`
	IsActive     bool   `json:"IsActive"`
}

func ListUser(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Permission_API(c)
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
		TotalRow, err := CountRows("core_user")
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		LimitQuery, res.Info = limit.LimitMaker(TotalRow)
		listUser, _ := ReadUserWithoutPhoto(query + " " + LimitQuery)
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

func LoginUser(c echo.Context) error {
	_, now_user, _ := Check_Permission_API(c)
	res := Response{}
	res.StatusCode = http.StatusOK
	res.Data = now_user
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
