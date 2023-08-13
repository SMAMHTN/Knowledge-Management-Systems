package core

import (
	"database/sql"
	"dependency"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

type Role struct {
	RoleID          int `json:"RoleID" query:"RoleID"`
	RoleName        string
	RoleParentID    int
	RoleDescription string
}

func ReadRole(args string) ([]Role, error) {
	var results []Role
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return []Role{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_role" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_role")
	}

	if err != nil {
		log.Println("WARNING " + err.Error())
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Role{}
		var err = sqlresult.Scan(&result.RoleID, &result.RoleName, &result.RoleParentID, &result.RoleDescription)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Role) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_role(RoleName, RoleParentID, RoleDescription) VALUES(?, ?, ?)")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.RoleName, data.RoleParentID, data.RoleDescription)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.RoleID = int(lastid)
	return int(lastid), nil
}

func (data *Role) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	if data.RoleID != 0 {
		err = database.QueryRow("SELECT * FROM core_role WHERE RoleID = ?", data.RoleID).Scan(&data.RoleID, &data.RoleName, &data.RoleParentID, &data.RoleDescription)
	} else {
		return errors.New("please insert roleid")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Role) CheckExist() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	if data.RoleID != 0 {
		err = database.QueryRow("SELECT RoleID FROM core_role WHERE RoleID = ?", data.RoleID).Scan(&data.RoleID)
	} else {
		return errors.New("please insert roleid")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Role) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_role SET RoleName=?, RoleParentID=?, RoleDescription=? WHERE RoleID=?;")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.RoleName, data.RoleParentID, data.RoleDescription, data.RoleID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Role) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	del, err := database.Prepare("DELETE FROM core_role WHERE `RoleID`=?")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	if data.RoleID != 0 {
		_, err = del.Exec(data.RoleID)
	} else {
		return errors.New("roleid needed")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	return nil
}

func (data Role) ListAllChild() ([]int, error) {
	var err error
	var childs = []int{}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return childs, err
	}
	defer database.Close()
	if data.RoleID != 0 {
		rows, err := database.Query(`
			WITH RECURSIVE rolechilds AS (
				SELECT RoleID,RoleParentID FROM core_role WHERE RoleID = ?
				UNION
				SELECT r.RoleID,r.RoleParentID FROM core_role AS r, rolechilds AS rc
				WHERE r.RoleParentID = rc.RoleID
			)
			SELECT RoleID FROM rolechilds
		`, data.RoleID)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return childs, err
		}
		for rows.Next() {
			var roleid int
			err := rows.Scan(&roleid)
			if err != nil {
				log.Println("WARNING " + err.Error())
				return childs, err
			}
			childs = append(childs, roleid)
		}
	} else {
		return childs, errors.New("roleid needed")
	}
	return childs, nil
}

func ListRole(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Permission_API(c)
	res := Response{}
	if permission {
		listRole, _ := ReadRole(query)
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	now_user := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	now_user.ReadLogin()
	if u.RoleID == now_user.RoleID {
		err = u.Read()
		if err != nil {
			log.Println("WARNING " + err.Error())
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
			log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		_, err = u.Create()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Role", "User "+now_user.Name+"("+now_user.Username+") Added Role : "+u.RoleName)
		if err != nil {
			log.Println("WARNING failed to record history " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Update()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Role", "User "+now_user.Name+"("+now_user.Username+") Edited Role : "+u.RoleName)
		if err != nil {
			log.Println("WARNING failed to record history " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.RoleID == 1 || u.RoleID == 2 {
		res.StatusCode = http.StatusBadRequest
		res.Data = "You Cannot Delete "
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.Delete()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED ROLE " + strconv.Itoa(u.RoleID)
		err = RecordHistory(c, "Role", "User "+now_user.Name+"("+now_user.Username+") Deleted Role : "+u.RoleName)
		if err != nil {
			log.Println("WARNING failed to record history " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	now_user := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	now_user.ReadLogin()
	if u.RoleID == now_user.RoleID {
		listchild, err := u.ListAllChild()
		if err != nil {
			log.Println("WARNING " + err.Error())
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
			log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.CheckExist()
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusNotFound
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	return c.JSON(http.StatusOK, res)
}
