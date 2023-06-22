package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Category struct {
	CategoryID          int
	CategoryName        string
	CategoryParentID    int
	CategoryDescription string
}

func ReadCategory(args string) ([]Category, error) {
	var results []Category
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []Category{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_category" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_category")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Category{}
		var err = sqlresult.Scan(&result.CategoryID, &result.CategoryName, &result.CategoryParentID, &result.CategoryDescription)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Category) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_category(CategoryName, CategoryParentID, CategoryDescription) VALUES(?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.CategoryName, data.CategoryParentID, data.CategoryDescription)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.CategoryID = int(lastid)
	return int(lastid), nil
}

func (data *Category) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.CategoryID != 0 {
		err = database.QueryRow("SELECT * FROM kms_category WHERE CategoryID = ?", data.CategoryID).Scan(&data.CategoryID, &data.CategoryName, &data.CategoryParentID, &data.CategoryDescription)
	} else {
		return errors.New("please insert categoryid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Category) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_category SET CategoryName=?, CategoryParentID=?, CategoryDescription=? WHERE CategoryID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.CategoryName, data.CategoryParentID, data.CategoryDescription, data.CategoryID)
	if err != nil {
		return err
	}
	return nil
}

func (data Category) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_category WHERE `CategoryID`=?")
	if err != nil {
		return err
	}
	if data.CategoryID != 0 {
		_, err = del.Exec(data.CategoryID)
	} else {
		return errors.New("categoryid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func (data Category) ListAllCategoryParent() ([]int, error) {
	var err error
	var parents = []int{}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return parents, err
	}
	defer database.Close()
	if data.CategoryID != 0 {
		rows, err := database.Query(`
			WITH RECURSIVE categoryparents AS (
				SELECT CategoryID,CategoryParentID FROM kms_category WHERE CategoryID = ?
				UNION
				SELECT r.CategoryID,r.CategoryParentID FROM kms_category AS r, categoryparents AS rc
				WHERE r.CategoryID = rc.CategoryParentID
			)
			SELECT CategoryID FROM categoryparents
		`, data.CategoryID)
		if err != nil {
			return parents, err
		}
		for rows.Next() {
			var categoryid int
			err := rows.Scan(&categoryid)
			if err != nil {
				return parents, err
			}
			parents = append(parents, categoryid)
		}
	} else {
		return parents, errors.New("categoryid needed")
	}
	return parents, nil
}

func (data Category) ListAllCategoryChild() ([]int, error) {
	var err error
	var Child = []int{}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return nil, err
	}
	defer database.Close()
	if data.CategoryID != 0 {
		rows, err := database.Query(`
			WITH RECURSIVE categoryparents AS (
				SELECT CategoryID,CategoryParentID FROM kms_category WHERE CategoryID = ?
				UNION
				SELECT r.CategoryID,r.CategoryParentID FROM kms_category AS r, categoryparents AS rc
				WHERE r.CategoryParentID = rc.CategoryID
			)
			SELECT CategoryID FROM categoryparents
		`, data.CategoryID)
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			var categoryid int
			err := rows.Scan(&categoryid)
			if err != nil {
				return nil, err
			}
			Child = append(Child, categoryid)
		}
	} else {
		return Child, errors.New("categoryid needed")
	}
	return Child, nil
}

func ListCategory(c echo.Context) error {
	query := c.QueryParam("query")
	permission, _, _ := Check_Admin_Permission_API(c)
	res := Response{}
	if permission {
		listCategory, _ := ReadCategory(query)
		res.StatusCode = http.StatusOK
		res.Data = listCategory
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func ListCategoryParent(c echo.Context) error {
	var err error
	res := Response{}
	u := new(Category)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	parents, err := u.ListAllCategoryParent()
	if err != nil {
		res.StatusCode = http.StatusNotFound
		// res.Data = "CATEGORY NOT FOUND"
		res.Data = err.Error()
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = parents
	return c.JSON(http.StatusOK, res)
}

func ListCategoryChild(c echo.Context) error {
	var err error
	res := Response{}
	u := new(Category)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	parents, err := u.ListAllCategoryChild()
	if err != nil {
		res.StatusCode = http.StatusNotFound
		// res.Data = "CATEGORY NOT FOUND"
		res.Data = err.Error()
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = parents
	return c.JSON(http.StatusOK, res)
}

func ShowCategory(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Category)
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
			res.Data = "CATEGORY NOT FOUND"
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

func AddCategory(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Category)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
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

func EditCategory(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Category)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
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

func DeleteCategory(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(Category)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.CategoryID == 1 || u.CategoryID == 2 {
		res.StatusCode = http.StatusBadRequest
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
		res.Data = "DELETED CATEGORY " + strconv.Itoa(u.CategoryID)
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}
