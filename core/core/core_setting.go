package core

import (
	"database/sql"
	"db"
	"errors"
)

type Setting struct {
	CompanyID      int
	CompanyName    string
	CompanyLogo    []byte
	CompanyAddress string
	TimeZone       string
	AppthemeID     int
}

func ReadSetting(args string) ([]Setting, error) {
	var results []Setting
	var sqlresult *sql.Rows
	var err error
	database, _ := db.Db_Connect("")
	if err != nil {
		return []Setting{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_setting" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_setting")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Setting{}
		var err = sqlresult.Scan(&result.CompanyID, &result.CompanyName, &result.CompanyLogo, &result.CompanyAddress, &result.TimeZone, &result.AppthemeID)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data Setting) Create() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_setting(CompanyName, CompanyLogo, CompanyAddress, Timezone, AppthemeID) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer ins.Close()
	_, err = ins.Exec(data.CompanyName, data.CompanyLogo, data.CompanyAddress, data.TimeZone, data.AppthemeID)
	if err != nil {
		return err
	}
	return nil
}

func (data *Setting) Read() error {
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	if data.CompanyID != 0 {
		err = database.QueryRow("SELECT * FROM core_setting WHERE CompanyID = ?", data.CompanyID).Scan(&data.CompanyID, &data.CompanyName, &data.CompanyLogo, &data.CompanyAddress, &data.TimeZone, &data.AppthemeID)
	} else {
		return errors.New("please insert companyid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Setting) Update() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_setting SET CompanyName=?, CompanyLogo=?, CompanyAddress=?, Timezone=?, AppthemeID=? WHERE CompanyID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.CompanyName, data.CompanyLogo, data.CompanyAddress, data.TimeZone, data.AppthemeID, data.CompanyID)
	if err != nil {
		return err
	}
	return nil
}

func (data Setting) Delete() error {
	var err error
	database, err := db.Db_Connect("")
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM core_setting WHERE `CompanyID`=?")
	if err != nil {
		return err
	}
	if data.CompanyID != 0 {
		_, err = del.Exec(data.CompanyID)
	} else {
		return errors.New("settingid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}
