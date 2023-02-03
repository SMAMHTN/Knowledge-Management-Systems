package main

import (
	"core"
	"fmt"
	// "setup"
)

func main() {
	var err error
	tablecore := core.History{HistoryID: 4}
	fmt.Println(tablecore)
	fmt.Println("test")
	err = tablecore.Delete()
	// fmt.Println(tablecore)
	// fmt.Println("test")
	// var ins = core.History{HistoryID: 1, ActivityType: "Tes", Time: time.Now(), UserID: 1, Changes: "tes", IPAddress: "tes"}
	// err = ins.Insert()
	if err != nil {
		fmt.Println(err)
	}

	// db.Execute_sql_file("core.sql", dependency.Conf.Appname)
	// role, err := core.CoreRole_Select("WHERE RoleID=0")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Println(role[0].RoleName)
}
