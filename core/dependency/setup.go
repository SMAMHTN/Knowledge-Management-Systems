package dependency

import (
	"fmt"
)

var Conf Configuration

func init() {
	defer fmt.Println("Dependency Setup Done")
	var err error
	Conf, err = Read_conf()
	if err != nil {
		panic("CONFIGURATION FILE ERROR : " + err.Error())
	}
	fmt.Println("Read Configuration")
	fmt.Printf("%v\n", Conf)
	// db.Execute_sql_file("core.sql", Appname)
}
