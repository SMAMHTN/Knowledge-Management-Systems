package core

import (
	"database/sql"
	"db"
)

type Role struct {
	RoleID          int
	RoleName        string
	RoleParentID    int
	RoleDescription string
}

func SelectRole(args string) ([]Role, error) {
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
