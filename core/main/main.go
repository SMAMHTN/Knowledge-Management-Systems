package main

import (
	"core"
	"db"
	dep "dependency"
	"fmt"
	// "setup"
)

func main() {
	database, _ := db.Db_Connect(dep.Conf.Appname)
	defer database.Close()
	fmt.Println("")
	fmt.Println(database)
	fmt.Println("")
	// db.Execute_sql_string_array(sqlslice, database)
	// db.Execute_sql_file("core.sql", dep.Conf.Appname)
	role, err := core.CoreRole_Select(" WHERE role_id=0")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(role[0].RoleName)
}
