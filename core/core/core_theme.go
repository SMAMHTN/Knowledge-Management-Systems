package core

import (
	"database/sql"
	"db"
	"errors"
)

type Theme struct {
	AppthemeID    int
	AppthemeName  string
	AppthemeValue string //json
}

func ReadTheme(args string) ([]Theme, error) {
	var results []Theme
	var sqlresult *sql.Rows
	var err error
	database, _ := db.Db_Connect("")
	if err != nil {
		return []Theme{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_theme" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_theme")
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

func (data Theme) Create() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_theme(AppthemeName, AppthemeValue) VALUES(?, ?)")
	if err != nil {
		return err
	}
	defer ins.Close()
	_, err = ins.Exec(data.AppthemeName, data.AppthemeValue)
	if err != nil {
		return err
	}
	return nil
}

func (data *Theme) Read() error {
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	if data.AppthemeID != 0 {
		err = database.QueryRow("SELECT * FROM core_theme WHERE AppthemeID = ?", data.AppthemeID).Scan(&data.AppthemeID, &data.AppthemeName, &data.AppthemeValue)
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
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_theme SET AppthemeName=?, AppthemeValue=? WHERE AppthemeID=?;")
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
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM core_theme WHERE `AppthemeID`=?")
	if err != nil {
		return err
	}
	if data.AppthemeID != 0 {
		_, err = del.Exec(data.AppthemeID)
	} else {
		return errors.New("roleid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}
