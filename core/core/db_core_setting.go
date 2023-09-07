package core

import (
	"database/sql"
	"dependency"
	"errors"
	"time"
)

type Setting struct {
	CompanyID         int    `json:"CompanyID" query:"CompanyID"`
	CompanyName       string `json:"CompanyName"`
	CompanyLogo       []byte `json:"-"`
	CompanyLogoBase64 string `json:"CompanyLogo"`
	CompanyAddress    string `json:"CompanyAddress"`
	TimeZone          string `json:"TimeZone"`
	AppthemeID        int    `json:"AppthemeID"`
}

func GetTime() time.Time {
	var TimeZone string

	Database.QueryRow("SELECT TimeZone FROM core_setting WHERE CompanyID = 1").Scan(&TimeZone)
	Timenow, _ := dependency.GetTime(TimeZone)
	return Timenow
}

func GetTimeZone() string {
	var TimeZone string

	Database.QueryRow("SELECT TimeZone FROM core_setting WHERE CompanyID = 1").Scan(&TimeZone)
	return TimeZone
}

func ReadSetting(args string) ([]Setting, error) {
	var results []Setting
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM core_setting" + " " + args)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM core_setting")
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

	ins, err := Database.Prepare("INSERT INTO core_setting(CompanyName, CompanyLogo, CompanyAddress, Timezone, AppthemeID) VALUES(?, ?, ?, ?, ?)")
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
	var err error
	if data.CompanyID != 0 {
		err = Database.QueryRow("SELECT * FROM core_setting WHERE CompanyID = ?", data.CompanyID).Scan(&data.CompanyID, &data.CompanyName, &data.CompanyLogo, &data.CompanyAddress, &data.TimeZone, &data.AppthemeID)
	} else {
		return errors.New("please insert companyid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *Setting) ReadAPI() error {
	err := data.Read()
	data.CompanyLogoBase64 = dependency.BytesToBase64(data.CompanyLogo)
	return err
}

func (data *Setting) UpdateAPI() error {
	var err error
	data.CompanyLogo, err = dependency.Base64ToBytes(data.CompanyLogoBase64)
	if err != nil {
		return err
	}
	err = data.Update()
	if err != nil {
		return err
	}
	return nil
}

func (data Setting) Update() error {
	var err error
	_, err = dependency.GetTime(data.TimeZone)
	if err != nil {
		return err
	}

	upd, err := Database.Prepare("UPDATE core.core_setting SET CompanyName=?, CompanyLogo=?, CompanyAddress=?, Timezone=?, AppthemeID=? WHERE CompanyID=?;")
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
	del, err := Database.Prepare("DELETE FROM core_setting WHERE `CompanyID`=?")
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

	return nil
}
