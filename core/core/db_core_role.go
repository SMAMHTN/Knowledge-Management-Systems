package core

import (
	"database/sql"
	"errors"
)

type Role struct {
	RoleID          int `json:"RoleID" query:"RoleID"`
	RoleName        string
	RoleParentID    int
	RoleDescription string
}

func ReadRole(args string, values []interface{}) ([]Role, error) {
	var results []Role
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM core_role"+" "+args, values...)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM core_role")
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

func (data *Role) Create() (int, error) {
	var err error

	ins, err := Database.Prepare("INSERT INTO core_role(RoleName, RoleParentID, RoleDescription) VALUES(?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.RoleName, data.RoleParentID, data.RoleDescription)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.RoleID = int(lastid)
	return int(lastid), nil
}

func (data *Role) Read() error {
	var err error
	if data.RoleID != 0 {
		err = Database.QueryRow("SELECT * FROM core_role WHERE RoleID = ?", data.RoleID).Scan(&data.RoleID, &data.RoleName, &data.RoleParentID, &data.RoleDescription)
	} else {
		return errors.New("please insert roleid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Role) CheckExist() error {
	var err error
	if data.RoleID != 0 {
		err = Database.QueryRow("SELECT RoleID FROM core_role WHERE RoleID = ?", data.RoleID).Scan(&data.RoleID)
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

	upd, err := Database.Prepare("UPDATE core.core_role SET RoleName=?, RoleParentID=?, RoleDescription=? WHERE RoleID=?;")
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
	del, err := Database.Prepare("DELETE FROM core_role WHERE `RoleID`=?")
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

	return nil
}

func (data Role) ListAllChild() ([]int, error) {
	var childs = []int{}

	if data.RoleID != 0 {
		rows, err := Database.Query(`
			WITH RECURSIVE rolechilds AS (
				SELECT RoleID,RoleParentID FROM core_role WHERE RoleID = ?
				UNION
				SELECT r.RoleID,r.RoleParentID FROM core_role AS r, rolechilds AS rc
				WHERE r.RoleParentID = rc.RoleID
			)
			SELECT RoleID FROM rolechilds
		`, data.RoleID)
		if err != nil {
			return childs, err
		}
		for rows.Next() {
			var roleid int
			err := rows.Scan(&roleid)
			if err != nil {
				return childs, err
			}
			childs = append(childs, roleid)
		}
	} else {
		return childs, errors.New("roleid needed")
	}
	return childs, nil
}
