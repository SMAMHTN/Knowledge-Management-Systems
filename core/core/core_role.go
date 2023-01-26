package core

import (
	"db"
)

type Role struct {
	RoleID          int
	RoleName        string
	RoleParentID    int
	RoleDescription string
}

func CoreRole_Select(args string) ([]Role, error) {
	var results []Role
	database, _ := db.Db_Connect("")
	defer database.Close()
	sqlresult, err := database.Query("SELECT * FROM core_role" + args)
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
