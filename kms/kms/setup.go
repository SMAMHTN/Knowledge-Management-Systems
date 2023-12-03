package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"strconv"

	"go.uber.org/zap"
)

var Logger *zap.Logger

var Conf dependency.Configuration

var Database *sql.DB

var LanguageDetector dependency.LanguageDetector

func init() {
	ConfigurationFile = filepath.Join("config", "appconf", "kms_conf.json")
	InstallDatabase = filepath.Join("config", "db_base", "kms.sql")
	var err error
	fmt.Println("---------------------------------------")
	fmt.Println("BEGIN PREPARING TO START KMS")
	fmt.Println("---------------------------------------")
	defer fmt.Println("KMS STARTED\n---------------------------------------")
	fmt.Println("---------------------------------------")
	fmt.Println("BEGIN READING FILE CONF")
	fmt.Println("---------------------------------------")
	config_file_loc_env := os.Getenv("kms_config_file")
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
	err = ConfigLanguageChecker()
	if err != nil {
		panic(err)
	}
	fmt.Println("Read Configuration")
	Conf = FillNeededEmptyField(Conf)
	Conf.Appname = AppName
	Port_conf = ":" + strconv.Itoa(Conf.Appport)
	v := reflect.ValueOf(Conf)
	t := v.Type()
	for i := 0; i < v.NumField(); i++ {
		fieldName := t.Field(i).Name
		fieldValue := v.Field(i).Interface()
		if fieldValue != nil {
			fmt.Printf("%s: %v\n", fieldName, fieldValue)
		}
	}
	fmt.Println("---------------------------------------")
	fmt.Println("READING FILE CONF DONE\n---------------------------------------")
	dependency.TimeZone, err = GetTimeZone()
	if err != nil {
		panic(err)
	}
	Logger, err = dependency.InitZapLog(Conf, Conf.Error_Log_location, Conf.Warn_Log_location, Conf.Info_Log_Location)
	if err != nil {
		panic(err)
	}
	Check_DB_Exist()
	Check_Filestore_Exist()
	err = SolrLanguageFieldInit()
	if err != nil {
		Logger.Panic("FAILED TO INIT SOLR LANGUAGE FIELD WITH THIS ERROR : " + err.Error())
	}
	LanguageDetector, err = dependency.NlpInit(Conf.Language)
	if err != nil {
		Logger.Panic("FAILED TO INIT LANGUAGE DETECTOR WITH THIS ERROR : " + err.Error())
	}
}

func Check_Dir_Exist(dirpath string) error {
	fileInfo, err := os.Stat(dirpath)

	if err == nil {
		if fileInfo.IsDir() {
			return nil
		} else {
			return errors.New("path exists, but it is not a directory")
		}
	} else if os.IsNotExist(err) {
		return errors.New("directory does not exist")
	} else {
		return err
	}
}

func Create_Filestore_Default() string {
	pathdoc := dependency.Get_Parent_Path() + "filestore/file"
	pathfile := dependency.Get_Parent_Path() + "filestore/doc"
	err := os.MkdirAll(pathdoc, 0777)
	if err != nil {
		panic(err)
	}
	err = os.MkdirAll(pathfile, 0777)
	if err != nil {
		panic(err)
	}
	return dependency.Get_Parent_Path() + "filestore/"
}

func Check_Filestore_Exist() {
	fmt.Println("Preparing Filestore for KMS")
	fmt.Println("Inputed Filestore Path : " + Conf.Filestore)
	if Conf.Filestore == "" {
		newFilestorePath := Create_Filestore_Default()
		Conf.Filestore = newFilestorePath
	} else if err := Check_Dir_Exist(Conf.Filestore + "file"); err != nil {
		newFilestorePath := Create_Filestore_Default()
		Conf.Filestore = newFilestorePath
	} else if err := Check_Dir_Exist(Conf.Filestore + "doc"); err != nil {
		newFilestorePath := Create_Filestore_Default()
		Conf.Filestore = newFilestorePath
	} else {
		fmt.Println("Filepath usable, Continuing using filepath....")
	}
	fmt.Println("Used Filestore Path : " + Conf.Filestore)
	fmt.Println("Done Preparing Filestore for KMS\n---------------------------------------")
}

func Check_DB_Exist() {
	var err error
	Database, err = dependency.Db_Connect_custom(Conf, DatabaseName, "parseTime=true")
	if err != nil {
		Logger.Panic(err.Error())
		panic(err)
	}
	Database.SetMaxOpenConns(9999)
	Database.SetMaxIdleConns(10)
	admincategorytest := Category{CategoryID: 1}
	err = admincategorytest.Read()
	if err != nil {
		fmt.Println("DB NOT FOUND\nINSTALLING DB FOR KMS\n---------------------------------------")
		err = dependency.Execute_sql_file(Conf, InstallDatabase, Conf.Appname)
		if err != nil {
			Logger.Panic(err.Error())
			panic(err)
		}
	}
}
func ConfigLanguageChecker() (err error) {
	if len(Conf.Language) < 1 {
		Conf.Language = []string{"English"}
	}
	for _, lang := range Conf.Language {
		_, exist := dependency.SolrStemLanguage[lang]
		if !exist {
			return errors.New(lang + " isnt supported language")
		}
	}
	return nil
}
func SolrLanguageFieldInit() (err error) {
	for _, lang := range Conf.Language {
		TypeExist, err := CheckSolrTypeFieldLanguage(lang)
		if err != nil {
			return err
		}
		Exist, err := CheckSolrFieldLanguage(lang)
		if err != nil {
			return err
		}
		CopyExist, err := CheckSolrCopyFieldLanguage(lang)
		if err != nil {
			return err
		}
		if !TypeExist {
			err = AddSolrTypeFieldLanguage(lang)
			if err != nil {
				return err
			}
		}
		if !Exist {
			err = AddSolrFieldLanguage(lang)
			if err != nil {
				return err
			}
		}
		if !CopyExist {
			err = AddSolrCopyFieldLanguage(lang)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func FillNeededEmptyField(data dependency.Configuration) dependency.Configuration {
	if data.Appname == "" {
		data.Appname = "kms"
	}
	if data.Appport == 0 {
		data.Appport = 5656
	}
	if data.App_password == "" {
		data.App_password = "aldim"
	}
	if data.Core_link == "" {
		data.Core_link = "http://core:6565"
	}
	if data.Core_password == "" {
		data.Core_password = "aldim"
	}
	if data.Db_link == "" {
		data.Db_link = "kms-db"
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
	// 	data.Filestore = "/kms/filestore/"
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
	if data.Tika_link == "" {
		data.Tika_link = "http://tika:9998"
	}
	if data.Solr_link == "" {
		data.Solr_link = "http://solr:8983"
	}
	if data.Solr_username == "" {
		data.Solr_username = "solr"
	}
	if data.Solr_password == "" {
		data.Solr_password = "SMAM"
	}
	if data.Max_upload == "" {
		data.Max_upload = "10G"
	}
	return data
}
