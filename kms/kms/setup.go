package kms

import (
	"dependency"
	"errors"
	"fmt"
	"log"
	"os"
	"reflect"
	"strconv"
)

var Conf dependency.Configuration

func init() {
	var err error
	fmt.Println("---------------------------------------")
	fmt.Println("BEGIN PREPARING TO START KMS")
	fmt.Println("---------------------------------------")
	defer fmt.Println("KMS STARTED\n---------------------------------------")
	fmt.Println("---------------------------------------")
	fmt.Println("BEGIN READING FILE CONF")
	fmt.Println("---------------------------------------")
	Conf, err = dependency.Read_conf(ConfigurationFile)
	if err != nil {
		log.Panic("FATAL CONFIGURATION FILE ERROR : " + err.Error())
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
	fmt.Println("---------------------------------------")
	fmt.Println("READING FILE CONF DONE\n---------------------------------------")
	err = dependency.Init_log(Conf.Log_Location)
	if err != nil {
		log.Panic("FATAL " + err.Error())
		panic(err)
	}
	Check_DB_Exist()
	Check_Filestore_Exist()
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
		log.Panic("FATAL " + err.Error())
		panic(err)
	}
	err = os.MkdirAll(pathfile, 0777)
	if err != nil {
		log.Panic("FATAL " + err.Error())
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
	admincategorytest := Category{CategoryID: 1}
	err = admincategorytest.Read()
	if err != nil {
		fmt.Println("DB NOT FOUND\nINSTALLING DB FOR KMS\n---------------------------------------")
		err = dependency.Execute_sql_file(Conf, InstallDatabase, Conf.Appname)
		if err != nil {
			log.Panic("FATAL " + err.Error())
			panic(err)
		}
	}
}
