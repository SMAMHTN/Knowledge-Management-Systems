package core

import (
	"database/sql"
	"errors"
	t "time"
)

type History struct {
	HistoryID    int `json:"HistoryID" query:"HistoryID"`
	ActivityType string
	Time         t.Time
	UserID       int
	Changes      string
	IPAddress    string
}

func EmptyHistory() History {
	return History{HistoryID: 0, ActivityType: "Test", Time: GetTime(), UserID: 1, Changes: "Test", IPAddress: "21120119120026"}
}

func ReadHistory(args string) ([]History, error) {
	var results []History
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM core_history" + " " + args)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM core_history")
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

func (data History) Create() (int, error) {
	var err error

	ins, err := Database.Prepare("INSERT INTO core_history(ActivityType, `Time`, UserID, Changes, IPAddress) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.ActivityType, data.Time, data.UserID, data.Changes, data.IPAddress)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	return int(lastid), nil
}

func (data *History) Read() error {
	var err error

	if data.HistoryID != 0 {
		err = Database.QueryRow("SELECT * FROM core_history WHERE HistoryID = ?", data.HistoryID).Scan(&data.HistoryID, &data.ActivityType, &data.Time, &data.UserID, &data.Changes, &data.IPAddress)
	} else {
		return errors.New("please insert historyid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data History) Update() error {
	var err error

	upd, err := Database.Prepare("UPDATE core.core_history SET ActivityType=?, `Time`=?, UserID=?, Changes=?, IPAddress=? WHERE HistoryID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.ActivityType, data.Time, data.UserID, data.Changes, data.IPAddress, data.HistoryID)
	if err != nil {
		return err
	}
	return nil
}

func (data History) Delete() error {
	var err error
	del, err := Database.Prepare("DELETE FROM core_history WHERE `HistoryID`=?")
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

	return nil
}
