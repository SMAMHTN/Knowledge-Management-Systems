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
	_, err = ins.Exec(data.RoleName,data.RoleParentID,data.RoleDescription)
	if err != nil {
		return err
	}
	return nil
}

// func (data *Role) Read() error {
// 	database, err := db.Db_Connect_custom("", "parseTime=true")
// 	if err != nil {
// 		return err
// 	}
// 	defer database.Close()
// 	if data.HistoryID != 0 {
// 		err = database.QueryRow("SELECT * FROM core_history WHERE HistoryID = ?", data.HistoryID).Scan(&data.HistoryID, &data.ActivityType, &data.Time, &data.UserID, &data.Changes, &data.IPAddress)
// 	} else {
// 		return errors.New("Please Insert HistoryID")
// 	}
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }

// func (data Role) Update() error {
// 	var err error
// 	database, err := db.Db_Connect("")
// 	if err != nil {
// 		return err
// 	}
// 	defer database.Close()
// 	upd, err := database.Prepare("UPDATE core.core_history SET ActivityType=?, `Time`=?, UserID=?, Changes=?, IPAddress=? WHERE HistoryID=?;")
// 	if err != nil {
// 		return err
// 	}
// 	defer upd.Close()
// 	_, err = upd.Exec(data.ActivityType, data.Time, data.UserID, data.Changes, data.IPAddress, data.HistoryID)
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }

// func (data Role) Delete() error {
// 	var err error
// 	database, err := db.Db_Connect("")
// 	del, err := database.Prepare("DELETE FROM core_history WHERE `HistoryID`=?")
// 	if err != nil {
// 		return err
// 	}
// 	if data.HistoryID != 0 {
// 		_, err = del.Exec(data.HistoryID)
// 	} else {
// 		return errors.New("HistoryID Needed")
// 	}
// 	if err != nil {
// 		return err
// 	}
// 	defer database.Close()
// 	return nil
// }
