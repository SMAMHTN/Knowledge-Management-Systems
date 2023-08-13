package core

import (
	"dependency"
	"fmt"
	"log"
	"reflect"
	"strconv"
)

var Conf dependency.Configuration

func Check_DB_Exist() {
	var err error
	adminusertest := User{UserID: 1}
	err = adminusertest.Read()
	if err != nil {
		fmt.Println("DB NOT FOUND\nINSTALLING DB FOR CORE\n---------------------------------------")
		err = dependency.Execute_sql_file(Conf, InstallDatabase, Conf.Appname)
		if err != nil {
			log.Panic(err)
			panic(err)
		}
		addphoto := User{UserID: 1}
		err = addphoto.Read()
		if err != nil {
			log.Panic(err)
			panic(err)
		}
		image, err := dependency.FilepathToByteArray("Aldi Mulyawan.jpg")
		if err != nil {
			log.Panic(err)
			panic(err)
		}
		addphoto.UserPhoto = image
		addphoto.Update()
	}
}

func init() {
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
		log.Panic(err)
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
	err = dependency.Init_log(Conf.Log_Location)
	if err != nil {
		log.Panic("FATAL " + err.Error())
		panic(err)
	}
	fmt.Println("READING FILE CONF DONE\n---------------------------------------")
	Check_DB_Exist()
	// db.Execute_sql_file("core.sql", Appname)
}
