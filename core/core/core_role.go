package core

import (
	"dependency"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func ListRole(c echo.Context) error {
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
		TotalRow, err := CountRows("core_role")
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		LimitQuery, res.Info = limit.LimitMaker(TotalRow)
		listRole, _ := ReadRole(query + " " + LimitQuery)
		res.StatusCode = http.StatusOK
		res.Data = listRole
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ShowRole(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Role)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, now_user, _ := Check_Permission_API(c)
	if u.RoleID == now_user.RoleID {
		err = u.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "ROLE NOT FOUND"
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
			res.Data = "ROLE NOT FOUND"
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

func AddRole(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Role)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		_, err = u.Create()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Role", "User "+now_user.Name+"("+now_user.Username+") Added Role : "+u.RoleName+"("+strconv.Itoa(u.RoleID)+")")
		if err != nil {
			Logger.Error("failed to record role change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func EditRole(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Role)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Role", "User "+now_user.Name+"("+now_user.Username+") Edited Role : "+u.RoleName+"("+strconv.Itoa(u.RoleID)+")")
		if err != nil {
			Logger.Error(" failed to record role change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteRole(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Role)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.RoleID == 1 || u.RoleID == 2 {
		res.StatusCode = http.StatusBadRequest
		res.Data = "You Cannot Delete this Role because this role constrain used by system"
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
		res.Data = "DELETED ROLE " + strconv.Itoa(u.RoleID)
		err = RecordHistory(c, "Role", "User "+now_user.Name+"("+now_user.Username+") Deleted Role : "+u.RoleName+"("+strconv.Itoa(u.RoleID)+")")
		if err != nil {
			Logger.Error(" failed to record role change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ListRoleChild(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Role)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, now_user, _ := Check_Permission_API(c)
	if u.RoleID == now_user.RoleID {
		listchild, err := u.ListAllChild()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "ROLE NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = listchild
		return c.JSON(http.StatusOK, res)
	} else if permission {
		listchild, err := u.ListAllChild()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "ROLE NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = listchild
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func CheckRoleExist(c echo.Context) error {
	var err error
	res := Response{}
	u := new(Role)
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
	return c.JSON(http.StatusOK, res)
}
