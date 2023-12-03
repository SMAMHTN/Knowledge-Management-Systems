package core

import (
	"database/sql"
	"dependency"
	"fmt"
	"os"
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
		// addphoto := User{UserID: 1}
		// err = addphoto.Read()
		// if err != nil {
		// 	return err
		// }
		// image, err := dependency.FilepathToByteArray("Aldi Mulyawan.jpg")
		// if err != nil {
		// 	return err
		// }
		// addphoto.UserPhoto = image
		// addphoto.Update()
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
	config_file_loc_env := os.Getenv("core_config_file")
	if config_file_loc_env != "" {
		fmt.Println("Using Configuration FIle at " + config_file_loc_env)
		Conf, err = dependency.Read_conf(config_file_loc_env)
		if err != nil {
			panic("CONFIGURATION FILE ERROR : " + err.Error())
		}
	} else {
		fmt.Println("Using Configuration FIle at " + ConfigurationFile)
		Conf, err = dependency.Read_conf(ConfigurationFile)
		if err != nil {
			panic("CONFIGURATION FILE ERROR : " + err.Error())
		}
	}
	fmt.Println("Read Configuration")
	Conf.Appname = AppName
	Port_conf = ":" + strconv.Itoa(Conf.Appport)
	Conf = FillNeededEmptyField(Conf)
	v := reflect.ValueOf(Conf)
	t := v.Type()

	for i := 0; i < v.NumField(); i++ {
		fieldName := t.Field(i).Name
		fieldValue := v.Field(i).Interface()
		if fieldValue != nil {
			fmt.Printf("%s: %v\n", fieldName, fieldValue)
		}
	}
	Logger, err = dependency.InitZapLog(Conf, Conf.Error_Log_location, Conf.Warn_Log_location, Conf.Info_Log_Location)
	if err != nil {
		panic(err)
	}
	fmt.Println("READING FILE CONF DONE\n---------------------------------------")
	err = Check_DB_Exist()
	if err != nil {
		Logger.Panic(err.Error())
	}
	// db.Execute_sql_file("core.sql", Appname)
}

func FillNeededEmptyField(data dependency.Configuration) dependency.Configuration {
	if data.Appname == "" {
		data.Appname = "core"
	}
	if data.Appport == 0 {
		data.Appport = 6565
	}
	if data.App_password == "" {
		data.App_password = "aldim"
	}
	// if data.Core_link == "" {
	// 	data.Core_link = "http://core:6565"
	// }
	// if data.Core_password == "" {
	// 	data.Core_password = "aldim"
	// }
	if data.Db_link == "" {
		data.Db_link = "core-db"
		data.Activate_Info_Log = true
		data.Activate_Warn_Log = true
		data.Activate_terminal_log = true
		data.Disable_Error_Log = false
	}
	if data.Db_username == "" {
		data.Db_username = "root"
	}
	if data.Db_password == "" {
		data.Db_password = "aldim"
	}
	// if data.Filestore == "" {
	// 	data.Filestore = "/core/filestore/"
	// }
	// if data.Error_Log_location == "" {
	// 	data.Error_Log_location = "default_error_log_location"
	// }
	// if data.Warn_Log_location == "" {
	// 	data.Warn_Log_location = "default_warn_log_location"
	// }
	// if data.Info_Log_Location == "" {
	// 	data.Info_Log_Location = "default_info_log_location"
	// }
	// if data.Tika_link == "" {
	// 	data.Tika_link = "http://tika:9998"
	// }
	// if data.Solr_link == "" {
	// 	data.Solr_link = "http://solr:8983"
	// }
	// if data.Solr_username == "" {
	// 	data.Solr_username = "solr"
	// }
	// if data.Solr_password == "" {
	// 	data.Solr_password = "SMAM"
	// }
	if data.Max_upload == "" {
		data.Max_upload = "10G"
	}
	return data
}
