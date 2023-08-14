package core

import (
	"database/sql"
	"dependency"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
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
	database, _ := dependency.Db_Connect(Conf, DatabaseName)
	defer database.Close()
	database.QueryRow("SELECT TimeZone FROM core_setting WHERE CompanyID = 1").Scan(&TimeZone)
	Timenow, _ := dependency.GetTime(TimeZone)
	return Timenow
}

func GetTimeZone() string{
	var TimeZone string
	database, _ := dependency.Db_Connect(Conf, DatabaseName)
	defer database.Close()
	database.QueryRow("SELECT TimeZone FROM core_setting WHERE CompanyID = 1").Scan(&TimeZone)
	return TimeZone
}

func ReadSetting(args string) ([]Setting, error) {
	var results []Setting
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return []Setting{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM core_setting" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM core_setting")
	}

	if err != nil {
		log.Println("WARNING " + err.Error())
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Setting{}
		var err = sqlresult.Scan(&result.CompanyID, &result.CompanyName, &result.CompanyLogo, &result.CompanyAddress, &result.TimeZone, &result.AppthemeID)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data Setting) Create() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO core_setting(CompanyName, CompanyLogo, CompanyAddress, Timezone, AppthemeID) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer ins.Close()
	_, err = ins.Exec(data.CompanyName, data.CompanyLogo, data.CompanyAddress, data.TimeZone, data.AppthemeID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data *Setting) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	if data.CompanyID != 0 {
		err = database.QueryRow("SELECT * FROM core_setting WHERE CompanyID = ?", data.CompanyID).Scan(&data.CompanyID, &data.CompanyName, &data.CompanyLogo, &data.CompanyAddress, &data.TimeZone, &data.AppthemeID)
	} else {
		return errors.New("please insert companyid")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		return err
	}
	err = data.Update()
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Setting) Update() error {
	var err error
	_, err = dependency.GetTime(data.TimeZone)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE core.core_setting SET CompanyName=?, CompanyLogo=?, CompanyAddress=?, Timezone=?, AppthemeID=? WHERE CompanyID=?;")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.CompanyName, data.CompanyLogo, data.CompanyAddress, data.TimeZone, data.AppthemeID, data.CompanyID)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	return nil
}

func (data Setting) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	del, err := database.Prepare("DELETE FROM core_setting WHERE `CompanyID`=?")
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	if data.CompanyID != 0 {
		_, err = del.Exec(data.CompanyID)
	} else {
		return errors.New("settingid needed")
	}
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	defer database.Close()
	return nil
}

func ShowSetting(c echo.Context) error {
	// var err error
	res := Response{}
	u := new(Setting)
	u.CompanyID = 1
	// err = c.Bind(u)
	// if err != nil { log.Println("WARNING " + err.Error())
	// 	res.StatusCode = http.StatusBadRequest
	// res.Data = err.Error()
	// 	return c.JSON(http.StatusBadRequest, res)
	// }
	_ = u.ReadAPI()
	// if err != nil { log.Println("WARNING " + err.Error())
	// 	res.StatusCode = http.StatusNotFound
	// 	res.Data = "THEME NOT FOUND"
	// 	return c.JSON(http.StatusNotFound, res)
	// }
	res.StatusCode = http.StatusOK
	res.Data = u
	return c.JSON(http.StatusOK, res)
}

func ExtractTimeZoneAPI(c echo.Context) error {
	res := Response{}
	res.StatusCode = http.StatusOK
	res.Data = GetTimeZone()
	return c.JSON(http.StatusOK, res)
}

func EditSetting(c echo.Context) error {
	permission, now_user, _ := Check_Permission_API(c)
	var err error
	res := Response{}
	u := new(Setting)
	err = c.Bind(u)
	if err != nil {
		log.Println("WARNING " + err.Error())
		res.StatusCode = http.StatusBadRequest
		res.Data = err.Error()
		return c.JSON(http.StatusBadRequest, res)
	}
	u.CompanyID = 1
	if permission {
		err = u.UpdateAPI()
		if err != nil {
			log.Println("WARNING " + err.Error())
			res.StatusCode = http.StatusConflict
			res.Data = err.Error()
			return c.JSON(http.StatusConflict, res)
		}
		u.Read()
		res.StatusCode = http.StatusOK
		res.Data = u
		err = RecordHistory(c, "Setting", "User "+now_user.Name+"("+now_user.Username+") Changed Setting")
		if err != nil {
			log.Println("WARNING failed to record setting change history " + err.Error())
		}
		return c.JSON(http.StatusOK, res)
	} else {
		res.StatusCode = http.StatusForbidden
		res.Data = "ONLY SUPERADMIN HAVE THIS PERMISSION"
		return c.JSON(http.StatusForbidden, res)
	}
}
