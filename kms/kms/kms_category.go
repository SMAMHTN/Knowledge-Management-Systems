package kms

import (
	"dependency"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type CategoryAPI struct {
	CategoryID          int `json:"CategoryID" query:"CategoryID"`
	CategoryName        string
	CategoryParentID    int
	CategoryParentName  string
	CategoryDescription string
}

func ListCategory(c echo.Context) error {

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
		TotalRow, err := CountRows("kms_category")
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(TotalRow)
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		listCategory, _ := ReadCategory(LimitQuery, ValuesQuery)
		var listCategoryAPI []CategoryAPI
		for _, x := range listCategory {
			listCategoryAPI = append(listCategoryAPI, x.ToAPI())
		}
		res.StatusCode = http.StatusOK
		res.Data = listCategoryAPI
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
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	parents, err := u.ListAllCategoryParent()
	if err != nil {
		Logger.Warn(err.Error())
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
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	parents, err := u.ListAllCategoryChild()
	if err != nil {
		Logger.Warn(err.Error())
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
	u := new(CategoryAPI)
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
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DATA INPUT ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		err = uOri.Read()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusNotFound
			res.Data = "CATEGORY NOT FOUND"
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

func AddCategory(c echo.Context) error {
	permission, _, _ := Check_Admin_Permission_API(c)
	var err error
	res := Response{}
	u := new(CategoryAPI)
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
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DATA INPUT ERROR : " + err.Error()
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
		err = RecordHistory(c, "Category", "Added Category : "+u.CategoryName+"("+strconv.Itoa(u.CategoryID)+")")
		if err != nil {
			Logger.Error("failed to record category change history " + err.Error())
		}
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
	u := new(CategoryAPI)
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
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DATA INPUT ERROR : " + err.Error()
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
		err = RecordHistory(c, "Category", "Edited Category : "+u.CategoryName+"("+strconv.Itoa(u.CategoryID)+")")
		if err != nil {
			Logger.Error("failed to record category change history " + err.Error())
		}
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
	u := new(CategoryAPI)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if u.CategoryID == 1 || u.CategoryID == 2 {
		res.StatusCode = http.StatusBadRequest
		res.Data = "You Cannot Delete this Role because this role constrain used by system"
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DATA INPUT ERROR : " + err.Error()
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
		res.Data = "DELETED CATEGORY " + strconv.Itoa(u.CategoryID)
		err = RecordHistory(c, "Category", "Deleted Category : "+u.CategoryName+"("+strconv.Itoa(u.CategoryID)+")")
		if err != nil {
			Logger.Error("failed to record category change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}

func (data Category) ToAPI() (res CategoryAPI) {
	res = CategoryAPI{
		CategoryID:          data.CategoryID,
		CategoryName:        data.CategoryName,
		CategoryParentID:    data.CategoryParentID,
		CategoryParentName:  "",
		CategoryDescription: data.CategoryDescription,
	}
	CategoryParent := Category{CategoryID: data.CategoryID}
	err := CategoryParent.Read()
	if err == nil {
		res.CategoryParentName = CategoryParent.CategoryName
	}
	return res
}

func (data CategoryAPI) ToTable() (res Category, err error) {
	res = Category{
		CategoryID:          data.CategoryID,
		CategoryName:        data.CategoryName,
		CategoryParentID:    data.CategoryParentID,
		CategoryDescription: data.CategoryDescription,
	}
	return res, nil
}
