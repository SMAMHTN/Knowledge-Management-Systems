package kms

import (
	"dependency"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

type Article_API struct {
	ArticleID            int `json:"ArticleID" query:"ArticleID"`
	OwnerID              int
	OwnerUsername        string
	OwnerName            string
	LastEditedByID       int
	LastEditedByUsername string
	LastEditedByName     string
	LastEditedTime       time.Time
	Tag                  []string
	Title                string
	CategoryID           int
	CategoryName         string
	CategoryParent       string
	CategoryDescription  string
	Article              string
	FileID               []int
	DocID                []int
	IsActive             bool
	Create               bool
	Read                 bool
	Update               bool
	Delete               bool
}

type CategoryPermission struct {
	CategoryID int
	Create     bool
	Read       bool
	Update     bool
	Delete     bool
}

func ListArticle(c echo.Context) error {
	var LimitQuery string
	var ValuesQuery []interface{}

	permission, user, _ := Check_Admin_Permission_API(c)
	res := ResponseList{}
	limit := new(dependency.QueryType)
	err := c.Bind(limit)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
	}
	if permission {
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "kms_article")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		ArticleList, _ := ReadArticle(LimitQuery, ValuesQuery)
		var ArticleListAPI []Article_API
		for _, x := range ArticleList {
			tmp, err := x.ToAPI(c)
			if err != nil {
				Logger.Error(err.Error())
				res.StatusCode = http.StatusInternalServerError
				res.Data = err
				return c.JSON(http.StatusInternalServerError, res)
			}
			tmp.Create = true
			tmp.Read = true
			tmp.Update = true
			tmp.Delete = true
			ArticleListAPI = append(ArticleListAPI, tmp)
		}
		res.StatusCode = http.StatusOK
		res.Data = ArticleListAPI
		return c.JSON(http.StatusOK, res)
	} else {
		AllowedCategoryList, err := GetCurrentUserReadCategoryList(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		var CategoryPermissionList []CategoryPermission
		for _, y := range AllowedCategoryList {
			var CategoryPermissionSingle = CategoryPermission{CategoryID: y}
			CategoryPermissionSingle.Create, CategoryPermissionSingle.Read, CategoryPermissionSingle.Update, CategoryPermissionSingle.Delete, err = GetTruePermission(c, y, role_id)
			if err != nil {
				Logger.Error(err.Error())
				res.StatusCode = http.StatusInternalServerError
				res.Data = err
				return c.JSON(http.StatusInternalServerError, res)
			}
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "kms_article")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		ArticleList, _ := ReadArticle(LimitQuery, ValuesQuery)
		var ArticleListAPI []Article_API
		for _, x := range ArticleList {
			tmp, err := x.ToAPI(c)
			if err != nil {
				Logger.Error(err.Error())
				res.StatusCode = http.StatusInternalServerError
				res.Data = err
				return c.JSON(http.StatusInternalServerError, res)
			}
			for _, CategoryPermissionSingle := range CategoryPermissionList {
				if tmp.CategoryID == CategoryPermissionSingle.CategoryID {
					tmp.Create = CategoryPermissionSingle.Create
					tmp.Read = CategoryPermissionSingle.Read
					tmp.Update = CategoryPermissionSingle.Update
					tmp.Delete = CategoryPermissionSingle.Delete
				}
			}
			ArticleListAPI = append(ArticleListAPI, tmp)
		}
		res.StatusCode = http.StatusOK
		res.Data = ArticleListAPI
		return c.JSON(http.StatusOK, res)
	}
}

func ListArticleID(c echo.Context) error {
	var LimitQuery string
	var ValuesQuery []interface{}

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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "kms_article")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		ArticleList, _ := ReadArticleID(LimitQuery, ValuesQuery)
		res.StatusCode = http.StatusOK
		res.Data = ArticleList
		return c.JSON(http.StatusOK, res)
	} else {
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
		LimitQuery, ValuesQuery, res.Info, err = limit.QueryMaker(nil, nil, nil, Database, "kms_article")
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		ArticleList, _ := ReadArticleID(LimitQuery, ValuesQuery)
		res.StatusCode = http.StatusOK
		res.Data = ArticleList
		return c.JSON(http.StatusOK, res)
	}
}

func ShowArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
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
		res.StatusCode = http.StatusBadRequest
		res.Data = "ARTICLE NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, TrueRead, TrueUpdate, _, err := GetTruePermission(c, uOri.CategoryID, role_id)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueRead || TrueUpdate || permission {
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
		res.Data = "YOU DONT HAVE PERMISSION TO READ THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func AddArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	TrueCreate, _, _, _, err := GetTruePermission(c, u.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueCreate || permission {
		uOri, err := u.ToTable()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		now_user_id, err := dependency.InterfaceToInt(user["UserID"])
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		uOri.OwnerID = now_user_id
		uOri.LastEditedByID = now_user_id
		uOri.LastEditedTime = time.Now()
		_, err = uOri.Create()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = "CREATE ERROR : " + err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		// resulta, err := u.ConvForSolr()
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// err = resulta.PrepareSolrData(c)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// _, _, err = SolrCallUpdate("POST", resulta)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		*u, err = uOri.ToAPI(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = *u
		err = RecordHistory(c, "Article", "Added Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
		if err != nil {
			Logger.Error("failed to record article change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO CREATE ARTICLE IN THIS CATEGORY"
		return c.JSON(http.StatusForbidden, res)
	}
}

func EditArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	Trueoriu, err := u.ToTable()
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	err = Trueoriu.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ORIGINAL NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, _, TrueUpdate, _, err := GetTruePermission(c, Trueoriu.CategoryID, role_id)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueUpdate || permission {
		// resulta, err := u.ConvForSolr()
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// err = resulta.PrepareSolrData(c)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		// _, _, err = SolrCallUpdate("POST", resulta)
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "UPDATE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		oriu, err := u.ToTable()
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		now_user_id, err := dependency.InterfaceToInt(user["UserID"])
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		oriu.LastEditedByID = now_user_id
		oriu.LastEditedTime = time.Now()
		oriu.FillEmpty(Trueoriu)
		err = oriu.Update()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "UPDATE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		*u, err = oriu.ToAPI(c)
		if err != nil {
			Logger.Error(err.Error())
			res.StatusCode = http.StatusInternalServerError
			res.Data = err
			return c.JSON(http.StatusInternalServerError, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = *u
		err = RecordHistory(c, "Article", "Edited Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
		if err != nil {
			Logger.Error("failed to record article change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO EDIT THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func DeleteArticle(c echo.Context) error {
	var err error
	var res Response
	u := new(Article_API)
	err = c.Bind(u)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	oriu, err := u.ToTable()
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	err = oriu.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "ORIGINAL ARTICLE NOT FOUND"
		return c.JSON(http.StatusBadRequest, res)
	}
	_, user, _ := Check_Admin_Permission_API(c)
	role_id, err := dependency.InterfaceToInt(user["RoleID"])
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	_, _, _, TrueDelete, err := GetTruePermission(c, oriu.CategoryID, role_id)
	// err = permission_kms.Read()
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusForbidden
		res.Data = err
		return c.JSON(http.StatusForbidden, res)
	}
	permission, _, _ := Check_Admin_Permission_API(c)
	if TrueDelete || permission {
		err = oriu.Delete()
		if err != nil {
			Logger.Warn(err.Error())
			res.StatusCode = http.StatusBadRequest
			res.Data = "DELETE ERROR : " + err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		// err = DeleteSolrDocument(strconv.Itoa(u.ArticleID))
		// if err != nil {
		// 	res.StatusCode = http.StatusBadRequest
		// 	res.Data = "DELETE ERROR : " + err.Error()
		// 	return c.JSON(http.StatusBadRequest, res)
		// }
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Article", "Deleted Article : "+u.Title+"("+strconv.Itoa(u.ArticleID)+")")
		if err != nil {
			Logger.Error("failed to record article change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "YOU DONT HAVE PERMISSION TO DELETE THIS ARTICLE"
		return c.JSON(http.StatusForbidden, res)
	}
}

func QueryArticle(c echo.Context) error {
	var err error
	var res Response
	query := c.QueryParam("query")
	q := c.QueryParam("q")
	search := c.QueryParam("search")
	pageString := c.QueryParam("page")
	show := c.QueryParam("show")
	page, err := strconv.Atoi(pageString)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : PAGE IS NOT A NUMBER - " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	numString := c.QueryParam("num")
	num, err := strconv.Atoi(numString)
	if err != nil {
		Logger.Warn(err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = "DATA INPUT ERROR : NUM IS NOT A NUMBER - " + err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	response, _, err := SolrCallQuery(c, q, query, search, page, num, show)
	if err != nil {
		Logger.Error(err.Error())
		res.StatusCode = http.StatusInternalServerError
		res.Data = err
		return c.JSON(http.StatusInternalServerError, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = string(response)
	return c.JSON(http.StatusOK, res)
}

func (data Article_Table) ToAPI(c echo.Context) (res Article_API, err error) {
	res.Article = data.Article
	res.ArticleID = data.ArticleID
	res.CategoryID = data.CategoryID
	res.DocID, err = dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		return res, err
	}
	res.FileID, err = dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		return res, err
	}
	res.IsActive = data.IsActive == 1
	res.LastEditedByID = data.LastEditedByID
	res.LastEditedTime = data.LastEditedTime
	res.OwnerID = data.OwnerID
	res.Tag = dependency.ConvStringToStringArray(data.Tag)
	res.Title = data.Title
	CategoryData := Category{
		CategoryID:          data.CategoryID,
		CategoryName:        "",
		CategoryParentID:    0,
		CategoryDescription: "",
	}
	err = CategoryData.Read()
	if err != nil {
		return res, err
	}
	res.CategoryName = CategoryData.CategoryName
	res.CategoryDescription = CategoryData.CategoryDescription
	res.OwnerName, res.OwnerUsername, err = GetNameUsername(c, data.OwnerID)
	if err != nil {
		return res, err
	}
	res.LastEditedByName, res.LastEditedByUsername, err = GetNameUsername(c, data.LastEditedByID)
	return res, err
}

func (data Article_API) ToTable() (res Article_Table, err error) {
	res.Article = data.Article
	res.ArticleID = data.ArticleID
	res.CategoryID = data.CategoryID
	res.DocID, err = dependency.ConvIntArrayToStringUnique(data.DocID)
	if err != nil {
		return res, err
	}
	res.FileID, err = dependency.ConvIntArrayToStringUnique(data.FileID)
	if err != nil {
		return res, err
	}
	res.IsActive = dependency.BooltoInt(data.IsActive)
	res.LastEditedByID = data.LastEditedByID
	res.LastEditedTime = data.LastEditedTime
	res.OwnerID = data.OwnerID
	res.Tag, err = dependency.ConvStringArrayToString(data.Tag)
	res.Title = data.Title
	return res, err
}

func (data *Article_Table) FillEmpty(res Article_Table) {
	if data.OwnerID == 0 {
		data.OwnerID = res.OwnerID
	}
	if data.Tag == "" {
		data.Tag = res.Tag
	}
	if data.Title == "" {
		data.Title = res.Title
	}
	if data.CategoryID == 0 {
		data.CategoryID = res.CategoryID
	}
	if data.Article == "" {
		data.Article = res.Article
	}
	if data.FileID == "" {
		data.FileID = res.FileID
	}
	if data.DocID == "" {
		data.DocID = res.DocID
	}
}

func ArticleAnotherTable(c echo.Context, Sort []dependency.SortType, Where []dependency.WhereType) (ResSort []dependency.SortType, ResWhere []dependency.WhereType, err error) {
	var sortownerposition int
	var sortowner []dependency.SortType
	var whereownerfirstposition bool
	var whereowner []dependency.WhereType
	var sortcategoryposition int
	var sortcategory []dependency.SortType
	var wherecategoryfirstposition bool
	var wherecategory []dependency.WhereType
	var sortLastEditedByposition int
	var sortLastEditedBy []dependency.SortType
	var whereLastEditedByfirstposition bool
	var whereLastEditedBy []dependency.WhereType
	for x, y := range Sort {
		switch y.Field {
		case "OwnerName", "OwnerUsername":
			if sortownerposition == 0 {
				sortownerposition = x + 1
			}
			y.Field = y.Field[5:]
			sortowner = append(sortowner, y)
		case "CategoryName", "CategoryDescription":
			if sortcategoryposition == 0 {
				sortcategoryposition = x + 1
			}
			sortcategory = append(sortcategory, y)
		case "LastEditedByName", "LastEditedByUsername":
			if sortLastEditedByposition == 0 {
				sortLastEditedByposition = x + 1
			}
			y.Field = y.Field[12:]
			sortLastEditedBy = append(sortLastEditedBy, y)
		default:
			ResSort = append(ResSort, y)
		}
	}
	for a, b := range Where {
		switch b.Field {
		case "OwnerName", "OwnerUsername":
			if !whereownerfirstposition && a == 0 {
				whereownerfirstposition = true
			}
			b.Field = b.Field[5:]
			whereowner = append(whereowner, b)
		case "CategoryName", "CategoryDescription":
			if !wherecategoryfirstposition && a == 0 {
				wherecategoryfirstposition = true
			}
			wherecategory = append(wherecategory, b)
		case "LastEditedByName", "LastEditedByUsername":
			if !whereLastEditedByfirstposition && a == 0 {
				whereLastEditedByfirstposition = true
			}
			b.Field = b.Field[12:]
			whereLastEditedBy = append(whereLastEditedBy, b)
		default:
			ResWhere = append(ResWhere, b)
		}
	}
	if len(sortowner) > 0 || len(whereowner) > 0 {
		RoleIDs, err := GetCoreIDs(c, "listuserid", sortowner, whereowner)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortowner) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(OwnerID," + dependency.ConvIntArrayToString(RoleIDs) + ")",
				Ascending: sortowner[0].Ascending,
			}
			ResSort = append(ResSort[:sortownerposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortownerposition-1:]...)...)
		}
		if len(whereowner) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "OwnerID",
				Operator: whereowner[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(RoleIDs),
			}
			if whereownerfirstposition {
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
	if len(sortLastEditedBy) > 0 || len(whereLastEditedBy) > 0 {
		LastEditedByIDs, err := GetCoreIDs(c, "listuserid", sortLastEditedBy, whereLastEditedBy)
		if err != nil {
			Logger.Error(err.Error())
			return ResSort, ResWhere, err
		}
		if len(sortLastEditedBy) > 0 {
			ConvertedSort := dependency.SortType{
				Field:     "FIELD(LastEditedByID," + dependency.ConvIntArrayToString(LastEditedByIDs) + ")",
				Ascending: sortLastEditedBy[0].Ascending,
			}
			ResSort = append(ResSort[:sortLastEditedByposition-1], append([]dependency.SortType{ConvertedSort}, ResSort[sortLastEditedByposition-1:]...)...)
		}
		if len(whereLastEditedBy) > 0 {
			ConvertedWhere := dependency.WhereType{
				Field:    "LastEditedByID",
				Operator: whereLastEditedBy[0].Operator,
				Logic:    "IN",
				Values:   dependency.SliceIntToInterface(LastEditedByIDs),
			}
			if whereLastEditedByfirstposition {
				ResWhere = append([]dependency.WhereType{ConvertedWhere}, ResWhere...)
			} else {
				ResWhere = append(ResWhere, ConvertedWhere)
			}
		}
	}
	return ResSort, ResWhere, nil
}
