package core

import (
	"database/sql"
	"db"
	"errors"
	t "time"
)

type History struct {
	HistoryID    int
	ActivityType string
	Time         t.Time
	UserID       int
	Changes      string
	IPAddress    string
}

func EmptyHistory() History {
	return History{HistoryID: 1, ActivityType: "a", Time: t.Now(), UserID: 1, Changes: "a", IPAddress: "a"}
}

func SelectHistory(args string) ([]History, error) {
	var results []History
	var sqlresult *sql.Rows
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return []History{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_history" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_history")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = History{}
		var err = sqlresult.Scan(&result.HistoryID, &result.ActivityType, &result.Time, &result.UserID, &result.Changes, &result.IPAddress)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *History) Select() error {
	database, err := db.Db_Connect_custom("", "parseTime=true")
	if err != nil {
		return err
	}
	defer database.Close()
	if data.HistoryID != 0 {
		err = database.QueryRow("SELECT * FROM core_history WHERE HistoryID = ?", data.HistoryID).Scan(&data.HistoryID, &data.ActivityType, &data.Time, &data.UserID, &data.Changes, &data.IPAddress)
	} else {
		return errors.New("Please Insert HistoryID")
	}
	if err != nil {
		return err
	}
	// return nil
	return nil
}

func (data History) Insert() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_history(ActivityType, `Time`, UserID, Changes, IPAddress) VALUES(?, ?, ?, ?, ?)")
	_, err = ins.Exec(data.ActivityType, data.Time, data.UserID, data.Changes, data.IPAddress)
	if err != nil {
		return err
	}
	return nil
}

func (data History) Delete() error {
	var err error
	database, err := db.Db_Connect("")
	del, err := database.Prepare("DELETE FROM core_history WHERE `HistoryID`=?")
	if err != nil {
		return err
	}
	if data.HistoryID != 0 {
		_, err = del.Exec(data.HistoryID)
	} else {
		return errors.New("HistoryID Needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}
