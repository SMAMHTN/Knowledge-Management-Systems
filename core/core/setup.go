package core

import (
	"database/sql"
	"dependency"
	"fmt"
	"path/filepath"
	"reflect"
	"strconv"

	"go.uber.org/zap"
)

var Conf dependency.Configuration

var Logger *zap.Logger

var Database *sql.DB

func Check_DB_Exist() error {
	var err error
	Database, err = dependency.Db_Connect_custom(Conf, DatabaseName, "parseTime=true")
	if err != nil {
		return err
	}
	Database.SetMaxOpenConns(9999)
	Database.SetMaxIdleConns(10)
	adminusertest := User{UserID: 1}
	err = adminusertest.Read()
	if err != nil {
		fmt.Println("DB NOT FOUND\nINSTALLING DB FOR CORE\n---------------------------------------")
		err = dependency.Execute_sql_file(Conf, InstallDatabase, Conf.Appname)
		if err != nil {
			return err
		}
		addphoto := User{UserID: 1}
		err = addphoto.Read()
		if err != nil {
			return err
		}
		image, err := dependency.FilepathToByteArray("Aldi Mulyawan.jpg")
		if err != nil {
			return err
		}
		addphoto.UserPhoto = image
		addphoto.Update()
	}
	return nil
}

func init() {
	ConfigurationFile = filepath.Join("config", "appconf", "core_conf.json")
	InstallDatabase = filepath.Join("config", "db_base", "core.sql")
	// db.Execute_sql_file("core.sql", Appname)
	fmt.Println("---------------------------------------")
	fmt.Println("BEGIN PREPARING TO START CORE")
	fmt.Println("---------------------------------------")
	defer fmt.Println("CORE STARTED\n---------------------------------------")
	fmt.Println("---------------------------------------")
	fmt.Println("BEGIN READING FILE CONF")
	fmt.Println("---------------------------------------")
	var err error
	Conf, err = dependency.Read_conf(ConfigurationFile)
	if err != nil {
		panic("CONFIGURATION FILE ERROR : " + err.Error())
	}
	fmt.Println("Read Configuration")
	Conf.Appname = AppName
	Port_conf = ":" + strconv.Itoa(Conf.Appport)
	v := reflect.ValueOf(Conf)
	t := v.Type()

	for i := 0; i < v.NumField(); i++ {
		fieldName := t.Field(i).Name
		fieldValue := v.Field(i).Interface()

		fmt.Printf("%s: %v\n", fieldName, fieldValue)
	}
	Logger, err = dependency.InitZapLog(Conf.Error_Log_location, Conf.Log_location)
	if err != nil {
		panic(err)
	}
	fmt.Println("READING FILE CONF DONE\n---------------------------------------")
	Check_DB_Exist()
	// db.Execute_sql_file("core.sql", Appname)
}
