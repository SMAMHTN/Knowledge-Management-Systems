package kms

import (
	"dependency"
	"encoding/json"
	"errors"
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
	if !permission {
		AllowedCategoryList, err := GetCurrentUserReadCategoryList(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		var wherequery []dependency.WhereType
		if limit.Query != "" {
			err = json.Unmarshal([]byte(limit.Query), &wherequery)
			if err != nil {
				err = errors.New("query field json read error : " + err.Error())
				Logger.Error(err.Error())
				res.StatusCode = http.StatusInternalServerError
				res.Data = err
				return c.JSON(http.StatusInternalServerError, res)
			}
		}
		var convertedAllowedCategoryList []interface{}
		for _, v := range AllowedCategoryList {
			convertedAllowedCategoryList = append(convertedAllowedCategoryList, v)
		}
		singlewherequery := dependency.WhereType{
			Field:    "CategoryID",
			Operator: "IN",
			Logic:    "AND",
			Values:   convertedAllowedCategoryList,
		}
		wherequery = append(wherequery, singlewherequery)
		a, err := json.Marshal(wherequery)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		limit.Query = string(a)
	}
	var LimitQuery string
	var ValuesQuery []interface{}
	LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(CategoryAnotherTable, nil, nil, Database, "kms_category")
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
}

func ListCategoryID(c echo.Context) error {

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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(CategoryAnotherTable, nil, nil, Database, "kms_category")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		listCategory, _ := ReadCategoryID(LimitQuery, ValuesQuery)
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
	AllowedCategoryList, err := GetCurrentUserReadCategoryList(c)
	if err != nil {
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
	}
	for _, singleid := range AllowedCategoryList {
		if singleid == u.CategoryID {
			permission = true
		}
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
		res.Data = "YOU DONT HAVE ACCESS"
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
	CategoryParent := Category{CategoryID: data.CategoryParentID}
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

func CategoryAnotherTable(Sort []dependency.SortType, Where []dependency.WhereType) (ResSort []dependency.SortType, ResWhere []dependency.WhereType, err error) {
	var sortcategoryposition int
	var sortcategory []dependency.SortType
	var wherecategoryfirstposition bool
	var wherecategory []dependency.WhereType
	for x, y := range Sort {
		switch y.Field {
		case "CategoryParentName", "CategoryParentDescription":
			if sortcategoryposition == 0 {
				sortcategoryposition = x + 1
			}
			y.Field = y.Field[:8] + y.Field[14:]
			sortcategory = append(sortcategory, y)
		default:
			ResSort = append(ResSort, y)
		}
	}
	for a, b := range Where {
		switch b.Field {
		case "CategoryParentName", "CategoryParentDescription":
			if !wherecategoryfirstposition && a == 0 {
				wherecategoryfirstposition = true
			}
			b.Field = b.Field[:8] + b.Field[14:]
			wherecategory = append(wherecategory, b)
		default:
			ResWhere = append(ResWhere, b)
		}
	}
	if len(sortcategory) > 0 || len(wherecategory) > 0 {
		tmpquery, tmpvalue, err := dependency.SortQueryMaker("", nil, sortcategory, wherecategory)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		RoleParentIDs, err := ReadCategoryID(tmpquery, tmpvalue)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortcategory) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(CategoryParentID," + dependency.ConvIntArrayToString(RoleParentIDs) + ")",
				Ascending: sortcategory[0].Ascending,
			}
			ResSort = append(ResSort[:sortcategoryposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortcategoryposition-1:]...)...)
		}
		if len(wherecategory) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "CategoryParentID",
				Operator: wherecategory[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(RoleParentIDs),
			}
			if wherecategoryfirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere)
			}
		}
	}
	return ResSort, ResWhere, nil
}
