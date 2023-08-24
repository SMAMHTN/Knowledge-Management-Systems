package core

import (
	"dependency"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func (data User) UpdateFromAPI() error {
	var err error
	data.UserPhoto, err = dependency.Base64ToBytes(data.UserPhotoBase64)
	if err != nil {
		return err
	}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_user SET UserPhoto=?, Username=?, Password=?, Name=?, Email=?, Address=?, Phone=?, RoleID=?, AppthemeID=?, Note=?, IsSuperAdmin=?, IsActive=? WHERE UserID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.UserPhoto, data.Username,
		data.Password, data.Name, data.Email, data.Address, data.Phone, data.RoleID,
		data.AppthemeID, data.Note, data.IsSuperAdmin, data.IsActive, data.UserID)
	if err != nil {
		return err
	}
	return nil
}

func ListUser(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Permission_API(c)
	res := Response{}
	limit := new(dependency.LimitType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		listUser, _ := ReadUserWithoutPhoto(query + " " + limit.LimitMaker())
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
	res.Data = now_user
	return c.JSON(http.StatusOK, res)
}

func ShowUser(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.UserID == now_user.UserID || u.UserID == 0 {
		u.UserID = now_user.UserID
		err = u.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "USER NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = u
		return c.JSON(http.StatusOK, res)
	} else if permission {
		err = u.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "USER NOT FOUND"
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

func AddUser(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		_, err = u.CreateFromAPI()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
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
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.UserID == now_user.UserID || u.UserID == 0 {
		u.UserID = now_user.UserID
		err = u.UpdateFromAPI()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Theme", "User "+now_user.Name+"("+now_user.Username+") Edited User : "+u.Name+"("+u.Username+")"+"("+strconv.Itoa(u.UserID)+")")
		if err != nil {
			Logger.Error(" failed to record user change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	}
	if permission {
		err = u.UpdateFromAPI()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
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
	u := new(User)
	err = c.Bind(u)
	if err != nil || u.UserID == 1 {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Delete()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED USER " + strconv.Itoa(u.UserID)
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
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.CheckExist()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusNotFound
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}
