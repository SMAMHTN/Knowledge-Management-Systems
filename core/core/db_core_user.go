package core

import (
	"database/sql"
	"errors"
)

type User struct {
	UserID       int    `json:"UserID" query:"UserID"`
	UserPhoto    []byte `json:"UserPhoto"`
	Username     string `json:"Username" query:"Username"`
	Password     string `json:"Password"`
	Name         string `json:"Name"`
	Email        string `json:"Email"`
	Address      string `json:"Address"`
	Phone        string `json:"Phone"`
	RoleID       int    `json:"RoleID"`
	AppthemeID   int    `json:"AppthemeID"`
	Note         string `json:"Note"`
	IsSuperAdmin int    `json:"IsSuperAdmin"`
	IsActive     int    `json:"IsActive"`
}

func ReadUser(args string) ([]User, error) {
	var results []User
	var sqlresult *sql.Rows
	var err error
	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM core_user" + " " + args)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM core_user")
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
		results = append(results, result)
	}
	return results, nil
}

func ReadUserWithoutPhoto(args string, values []interface{}) ([]User, error) {
	var results []User
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user"+" "+args, values...)
	} else {
		sqlresult, err = Database.Query("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user")
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
		results = append(results, result)
	}
	return results, nil
}

func ReadUserIDWithoutPhoto(args string, values []interface{}) ([]int, error) {
	var results []int
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT UserID FROM core_user"+" "+args, values...)
	} else {
		sqlresult, err = Database.Query("SELECT UserID FROM core_user")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result int
		var err = sqlresult.Scan(&result)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *User) Create() (int, error) {
	var err error
	if err != nil {
		return 0, err
	}

	ins, err := Database.Prepare("INSERT INTO core.core_user (UserPhoto, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
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
	var err error
	if data.UserID != 0 {
		err = Database.QueryRow("SELECT * FROM core_user WHERE UserID = ?", data.UserID).Scan(
			&data.UserID, &data.UserPhoto, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else if data.Username != "" {
		err = Database.QueryRow("SELECT * FROM core_user WHERE Username = ?", data.Username).Scan(
			&data.UserID, &data.UserPhoto, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert UserID or Username")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *User) CheckExist() error {
	var err error
	if data.UserID != 0 {
		err = Database.QueryRow("SELECT UserID,Username,Name FROM core_user WHERE UserID = ?", data.UserID).Scan(&data.UserID, &data.Username, &data.Name)
	} else {
		return errors.New("please insert UserID")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *User) ReadWithoutPhoto() error {
	var err error
	if data.UserID != 0 {
		err = Database.QueryRow("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user WHERE UserID = ?", data.UserID).Scan(
			&data.UserID, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else if data.Username != "" {
		err = Database.QueryRow("SELECT UserID, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive FROM core_user WHERE Username = ?", data.Username).Scan(
			&data.UserID, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert UserID or Username")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *User) ReadLogin() error {
	var err error
	if data.Username != "" && data.Password != "" {
		err = Database.QueryRow("SELECT UserID, Username, Password, Name, RoleID, AppthemeID, IsSuperAdmin, IsActive FROM core_user WHERE Username = ? AND Password = ? AND IsActive = 1", data.Username, data.Password).Scan(
			&data.UserID, &data.Username,
			&data.Password, &data.Name, &data.RoleID,
			&data.AppthemeID, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert Username & Password")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data User) Update() error {
	if data.UserID != 0 {
		upd, err := Database.Prepare("UPDATE core.core_user SET UserPhoto=?, Username=?, Password=?, Name=?, Email=?, Address=?, Phone=?, RoleID=?, AppthemeID=?, Note=?, IsSuperAdmin=?, IsActive=? WHERE UserID=?;")
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
	} else {
		return errors.New("please insert UserID or Username")
	}
	return nil
}

func (data User) Delete() error {
	var err error
	del, err := Database.Prepare("DELETE FROM core_user WHERE `UserID`=?")
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

	return nil
}
