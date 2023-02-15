package core

import (
	"database/sql"
	"db"
	"errors"
)

type User struct {
	UserID       int
	UserPhoto    []byte
	Username     string
	Password     string
	Name         string
	Email        string
	Address      string
	Phone        string
	RoleID       int
	AppthemeID   int
	Note         string
	IsSuperAdmin int
	IsActive     int
}

func ReadUser(args string) ([]User, error) {
	var results []User
	var sqlresult *sql.Rows
	var err error
	database, _ := db.Db_Connect("")
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
		results = append(results, result)
	}
	return results, nil
}

func (data User) Create() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core.core_user (UserPhoto, Username, Password, Name, Email, Address, Phone, RoleID, AppthemeID, Note, IsSuperAdmin, IsActive) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
	if err != nil {
		return err
	}
	defer ins.Close()
	_, err = ins.Exec(data.UserPhoto, data.Username,
		data.Password, data.Name, data.Email, data.Address, data.Phone, data.RoleID,
		data.AppthemeID, data.Note, data.IsSuperAdmin, data.IsActive)
	if err != nil {
		return err
	}
	return nil
}

func (data *User) Read() error {
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	if data.UserID != 0 {
		err = database.QueryRow("SELECT * FROM core_user WHERE UserID = ?", data.UserID).Scan(
			&data.UserID, &data.UserPhoto, &data.Username,
			&data.Password, &data.Name, &data.Email, &data.Address, &data.Phone, &data.RoleID,
			&data.AppthemeID, &data.Note, &data.IsSuperAdmin, &data.IsActive)
	} else {
		return errors.New("please insert appthemeid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data User) Update() error {
	var err error
	database, err := db.Db_Connect("")
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
	database, err := db.Db_Connect("")
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
