package core

import (
	"database/sql"
	"errors"
)

type Theme struct {
	AppthemeID    int `json:"AppthemeID" query:"AppthemeID"`
	AppthemeName  string
	AppthemeValue string //json
}

func ReadTheme(args string) ([]Theme, error) {
	var results []Theme
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM core_theme" + " " + args)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM core_theme")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Theme{}
		var err = sqlresult.Scan(&result.AppthemeID, &result.AppthemeName, &result.AppthemeValue)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Theme) Create() (int, error) {
	var err error

	ins, err := Database.Prepare("INSERT INTO core_theme(AppthemeName, AppthemeValue) VALUES(?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.AppthemeName, data.AppthemeValue)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.AppthemeID = int(lastid)
	return int(lastid), nil
}

func (data *Theme) Read() error {
	var err error
	if data.AppthemeID != 0 {
		err = Database.QueryRow("SELECT * FROM core_theme WHERE AppthemeID = ?", data.AppthemeID).Scan(&data.AppthemeID, &data.AppthemeName, &data.AppthemeValue)
	} else {
		return errors.New("please insert appthemeid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Theme) Update() error {
	var err error

	upd, err := Database.Prepare("UPDATE core.core_theme SET AppthemeName=?, AppthemeValue=? WHERE AppthemeID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.AppthemeName, data.AppthemeValue, data.AppthemeID)
	if err != nil {
		return err
	}
	return nil
}

func (data Theme) Delete() error {
	var err error
	del, err := Database.Prepare("DELETE FROM core_theme WHERE `AppthemeID`=?")
	if err != nil {
		return err
	}
	if data.AppthemeID != 0 {
		_, err = del.Exec(data.AppthemeID)
	} else {
		return errors.New("appthemeid needed")
	}
	if err != nil {
		return err
	}

	return nil
}
