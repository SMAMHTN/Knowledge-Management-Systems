package core

import (
	"database/sql"
	"dependency"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

type User struct {
	UserID          int    `json:"UserID"`
	UserPhoto       []byte `json:"-"`
	UserPhotoBase64 string `json:"UserPhoto"`
	Username        string `json:"Username"`
	Password        string `json:"Password"`
	Name            string `json:"Name"`
	Email           string `json:"Email"`
	Address         string `json:"Address"`
	Phone           string `json:"Phone"`
	RoleID          int    `json:"RoleID"`
	AppthemeID      int    `json:"AppthemeID"`
	Note            string `json:"Note"`
	IsSuperAdmin    int    `json:"IsSuperAdmin"`
	IsActive        int    `json:"IsActive"`
}

func ReadUser(args string) ([]User, error) {
	var results []User
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []User{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_user" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_user")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = User{}
		var err = sqlresult.Scan(&result.UserID, &result.UserPhoto, &result.Username,
			&result.Password, &result.Name, &result.Email, &result.Address, &result.Phone, &result.RoleID,
			&result.AppthemeID, &result.Note, &result.IsSuperAdmin, &result.IsActive)
		if err != nil {
			return results, err
		}
		result.UserPhotoBase64 = dependency.BytesToBase64(result.UserPhoto)
		results = append(results, result)
	}
	return results, nil
}

func ReadUserWithoutPhoto(args string) ([]User, error) {
	var results []User
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []User{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = User{}
		var err = sqlresult.Scan(&result.UserID, &result.Username,
			&result.Password, &result.Name, &result.Email, &result.Address, &result.Phone, &result.RoleID,
			&result.AppthemeID, &result.Note, &result.IsSuperAdmin, &result.IsActive)
		if err != nil {
			return results, err
		}
		result.UserPhotoBase64 = dependency.BytesToBase64(result.UserPhoto)
		results = append(results, result)
	}
	return results, nil
}

func (data *User) Create() (int, error) {
	var err error
	if err != nil {
		return 0, err
	}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core.core_user (UserPhoto, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.UserPhoto, data.Username,
		data.Password, data.Name, data.Email, data.Address, data.Phone, data.RoleID,
		data.AppthemeID, data.Note, data.IsSuperAdmin, data.IsActive)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.UserID = int(lastid)
	return int(lastid), nil
}

func (data *User) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.UserID != 0 {
		err = database.QueryRow("SELECT * FROM core_user WHERE UserID = ?", data.UserID).Scan(
			&data.UserID, &data.UserPhoto, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else if data.Username != "" {
		err = database.QueryRow("SELECT * FROM core_user WHERE Username = ?", data.Username).Scan(
			&data.UserID, &data.UserPhoto, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert UserID or Username")
	}
	data.UserPhotoBase64 = dependency.BytesToBase64(data.UserPhoto)
	if err != nil {
		return err
	}
	return nil
}

func (data *User) CheckExist() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.UserID != 0 {
		err = database.QueryRow("SELECT UserID,Username,Name FROM core_user WHERE UserID = ?", data.UserID).Scan(&data.UserID, &data.Username, &data.Name)
	} else {
		return errors.New("please insert UserID")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *User) ReadWithoutPhoto() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.UserID != 0 {
		err = database.QueryRow("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user WHERE UserID = ?", data.UserID).Scan(
			&data.UserID, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else if data.Username != "" {
		err = database.QueryRow("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user WHERE Username = ?", data.Username).Scan(
			&data.UserID, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert UserID or Username")
	}
	data.UserPhotoBase64 = dependency.BytesToBase64(data.UserPhoto)
	if err != nil {
		return err
	}
	return nil
}

func (data *User) ReadLogin() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.Username != "" && data.Password != "" {
		err = database.QueryRow("SELECT UserID, Username, Password, Name, RoleID, AppthemeID, IsSuperAdmin, IsActive FROM core_user WHERE Username = ? AND Password = ?", data.Username, data.Password).Scan(
			&data.UserID, &data.Username,
			&data.Password, &data.Name, &data.RoleID,
			&data.AppthemeID, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert Username & Password")
	}
	data.UserPhotoBase64 = dependency.BytesToBase64(data.UserPhoto)
	if err != nil {
		return err
	}
	return nil
}

func (data User) Update() error {
	var err error
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

func (data User) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM core_user WHERE `UserID`=?")
	if err != nil {
		return err
	}
	if data.UserID != 0 {
		_, err = del.Exec(data.UserID)
	} else {
		return errors.New("userid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func (data User) CreateFromAPI() (int, error) {
	var err error
	data.UserPhoto, err = dependency.Base64ToBytes(data.UserPhotoBase64)
	if err != nil {
		return 0, err
	}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core.core_user (UserPhoto, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.UserPhoto, data.Username,
		data.Password, data.Name, data.Email, data.Address, data.Phone, data.RoleID,
		data.AppthemeID, data.Note, data.IsSuperAdmin, data.IsActive)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	return int(lastid), nil
}

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
	if permission {
		listUser, _ := ReadUserWithoutPhoto(query)
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
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	now_user := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	now_user.ReadLogin()
	res := Response{}
	res.StatusCode = http.StatusOK
	res.Data = now_user
	return c.JSON(http.StatusOK, res)
}

func ShowUser(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	_, userpass, _ := c.Request().BasicAuth()
	cred := strings.Split(userpass, "&&")
	now_user := User{Username: dependency.GetElementString(cred, 0), Password: dependency.GetElementString(cred, 1)}
	now_user.Read()
	if u.UserID == now_user.UserID {
		res.StatusCode = http.StatusOK
		res.Data = now_user
		return c.JSON(http.StatusOK, res)
	} else if permission {
		err = u.Read()
		if err != nil {
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
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		_, err = u.CreateFromAPI()
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

func EditUser(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(User)
	err = c.Bind(u)
	if err != nil {
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	if permission {
		err = u.UpdateFromAPI()
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

func DeleteUser(c echo.Context) error {
	permission, _, _ := Check_Permission_API(c)
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
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		res.StatusCode = http.StatusOK
		res.Data = "DELETED USER " + strconv.Itoa(u.UserID)
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
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	err = u.CheckExist()
	if err != nil {
		res.StatusCode = http.StatusNotFound
		return c.JSON(http.StatusNotFound, res)
	}
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}
