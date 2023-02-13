package core

import (
	"database/sql"
	"db"
	"errors"
)

type Role struct {
	RoleID          int
	RoleName        string
	RoleParentID    int
	RoleDescription string
}

func ReadRole(args string) ([]Role, error) {
	var results []Role
	var sqlresult *sql.Rows
	var err error
	database, _ := db.Db_Connect("")
	if err != nil {
		return []Role{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_role" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_role")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Role{}
		var err = sqlresult.Scan(&result.RoleID, &result.RoleName, &result.RoleParentID, &result.RoleDescription)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data Role) Create() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_role(RoleName, RoleParentID, RoleDescription) VALUES(?, ?, ?)")
	if err != nil {
		return err
	}
	defer ins.Close()
	_, err = ins.Exec(data.RoleName, data.RoleParentID, data.RoleDescription)
	if err != nil {
		return err
	}
	return nil
}

func (data *Role) Read() error {
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	if data.RoleID != 0 {
		err = database.QueryRow("SELECT * FROM core_role WHERE RoleID = ?", data.RoleID).Scan(&data.RoleID, &data.RoleName, &data.RoleParentID, &data.RoleDescription)
	} else {
		return errors.New("please insert roleid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Role) Update() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_role SET RoleName=?, RoleParentID=?, RoleDescription=? WHERE RoleID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.RoleName, data.RoleParentID, data.RoleDescription, data.RoleID)
	if err != nil {
		return err
	}
	return nil
}

func (data Role) Delete() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM core_role WHERE `RoleID`=?")
	if err != nil {
		return err
	}
	if data.RoleID != 0 {
		_, err = del.Exec(data.RoleID)
	} else {
		return errors.New("roleid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}
