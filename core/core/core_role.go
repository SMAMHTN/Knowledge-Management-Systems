package core

import (
	"dependency"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type RoleAPI struct {
	RoleID          int `json:"RoleID" query:"RoleID"`
	RoleName        string
	RoleParentID    int
	RoleParentName  string
	RoleDescription string
}

func ListRole(c echo.Context) error {
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(RoleAnotherTable, Database, "core_role")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		listRole, _ := ReadRole(LimitQuery, ValuesQuery)
		var listRoleApi []RoleAPI
		for _, y := range listRole {
			listRoleApi = append(listRoleApi, y.ToAPI())
		}
		res.StatusCode = http.StatusOK
		res.Data = listRoleApi
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ListRoleID(c echo.Context) error {
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(RoleAnotherTable, Database, "core_role")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		listRole, _ := ReadRoleID(LimitQuery, ValuesQuery)
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
	u := new(RoleAPI)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, now_user, _ := Check_Permission_API(c)
	if u.RoleID == now_user.RoleID {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "ROLE NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = uOri.ToAPI()
		return c.JSON(http.StatusOK, res)
	} else if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "ROLE NOT FOUND"
			return c.JSON(http.StatusNotFound, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = uOri.ToAPI()
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
	u := new(RoleAPI)
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
			res.Data = err.Error()
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
		res.StatusCode = http.StatusOK
		res.Data = uOri.ToAPI()
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
	u := new(RoleAPI)
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
			res.Data = err.Error()
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
		res.StatusCode = http.StatusOK
		res.Data = uOri.ToAPI()
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
	u := new(RoleAPI)
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
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
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

func (data Role) ToAPI() (res RoleAPI) {
	res = RoleAPI{
		RoleID:          data.RoleID,
		RoleName:        data.RoleName,
		RoleParentID:    data.RoleParentID,
		RoleParentName:  "",
		RoleDescription: data.RoleDescription,
	}
	RoleParent := Role{RoleID: data.RoleParentID}
	err := RoleParent.Read()
	if err != nil {
		res.RoleParentName = ""
	} else {
		res.RoleParentName = RoleParent.RoleName
	}
	return res
}

func (data RoleAPI) ToTable() (res Role, err error) {
	res = Role{
		RoleID:          data.RoleID,
		RoleName:        data.RoleName,
		RoleParentID:    data.RoleParentID,
		RoleDescription: data.RoleDescription,
	}
	return res, nil
}

func RoleAnotherTable(Sort []dependency.SortType, Where []dependency.WhereType) (ResSort []dependency.SortType, ResWhere []dependency.WhereType, err error) {
	var sortroleposition int
	var sortrole []dependency.SortType
	var whererolefirstposition bool
	var whereuser []dependency.WhereType
	for x, y := range Sort {
		switch y.Field {
		case "RoleParentName", "RoleParentDescription":
			if sortroleposition == 0 {
				sortroleposition = x + 1
			}
			y.Field = y.Field[:4] + y.Field[10:]
			sortrole = append(sortrole, y)
		default:
			ResSort = append(ResSort, y)
		}
	}
	for a, b := range Where {
		switch b.Field {
		case "RoleParentName", "RoleParentDescription":
			if !whererolefirstposition && a == 0 {
				whererolefirstposition = true
			}
			b.Field = b.Field[:4] + b.Field[10:]
			whereuser = append(whereuser, b)
		default:
			ResWhere = append(ResWhere, b)
		}
	}
	if len(sortrole) > 0 || len(whereuser) > 0 {
		tmpquery, tmpvalue, err := dependency.SortQueryMaker("", nil, sortrole, whereuser)
		if err != nil {
			return ResSort, ResWhere, err
		}
		RoleParentIDs, err := ReadRoleID(tmpquery, tmpvalue)
		if err != nil {
			return ResSort, ResWhere, err
		}
		if len(sortrole) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(RoleParentID," + dependency.ConvIntArrayToString(RoleParentIDs) + ")",
				Ascending: sortrole[0].Ascending,
			}
			ResSort = append(ResSort[:sortroleposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortroleposition-1:]...)...)
		}
		if len(whereuser) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "RoleParentID",
				Operator: whereuser[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(RoleParentIDs),
			}
			if whererolefirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere)
			}
		}
	}
	return ResSort, ResWhere, nil
}
