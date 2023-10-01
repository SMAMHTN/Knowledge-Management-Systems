package kms

import (
	"database/sql"
	"errors"
)

type Permission struct {
	PermissionID int `json:"PermissionID" query:"PermissionID"`
	CategoryID   int
	RoleID       int
	PCreate      int    `json:"Create"`
	PRead        int    `json:"Read"`
	PUpdate      int    `json:"Update"`
	PDelete      int    `json:"Delete"`
	FileType     string //json
	DocType      string //json
}

func ReadPermission(args string, values []interface{}) ([]Permission, error) {
	var results []Permission
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM kms_permission"+" "+args, values...)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM kms_permission")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Permission{}
		var err = sqlresult.Scan(&result.PermissionID, &result.CategoryID, &result.RoleID, &result.PCreate, &result.PRead, &result.PUpdate, &result.PDelete, &result.FileType, &result.DocType)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Permission) Create() (int, error) {
	var err error

	ins, err := Database.Prepare("INSERT INTO kms_permission(CategoryID, RoleID, `Create`, `Read`, `Update`, `Delete`, `FileType`, `DocType`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.CategoryID, data.RoleID, data.PCreate, data.PRead, data.PUpdate, data.PDelete, data.FileType, data.DocType)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.PermissionID = int(lastid)
	return int(lastid), nil
}

func (data *Permission) Read() error {
	var err error
	if data.PermissionID != 0 {
		err = Database.QueryRow("SELECT * FROM kms_permission WHERE PermissionID = ?", data.PermissionID).Scan(&data.PermissionID, &data.CategoryID, &data.RoleID, &data.PCreate, &data.PRead, &data.PUpdate, &data.PDelete, &data.FileType, &data.DocType)
	} else if data.CategoryID != 0 && data.RoleID != 0 {
		err = Database.QueryRow("SELECT * FROM kms_permission WHERE CategoryID = ? AND RoleID = ?", data.CategoryID, data.RoleID).Scan(&data.PermissionID, &data.CategoryID, &data.RoleID, &data.PCreate, &data.PRead, &data.PUpdate, &data.PDelete, &data.FileType, &data.DocType)
	} else {
		return errors.New("please insert permissionid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Permission) Update() error {
	var err error

	upd, err := Database.Prepare("UPDATE kms.kms_permission SET CategoryID=?, RoleID=?, `Create`=?, `Read`=?, `Update`=?, `Delete`=?, `FileType`=?, `DocType`=? WHERE PermissionID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.CategoryID, data.RoleID, data.PCreate, data.PRead, data.PUpdate, data.PDelete, data.FileType, data.DocType, data.PermissionID)
	if err != nil {
		return err
	}
	return nil
}

func (data Permission) Delete() error {
	var err error
	del, err := Database.Prepare("DELETE FROM kms_permission WHERE `PermissionID`=?")
	if err != nil {
		return err
	}
	if data.PermissionID != 0 {
		_, err = del.Exec(data.PermissionID)
	} else {
		return errors.New("permissionid needed")
	}
	if err != nil {
		return err
	}

	return nil
}
