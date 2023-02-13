package main

import (
	"core"
	"fmt"
	// "setup"
)

func main() {
	// err := db.Execute_sql_file("core_no_fk_del.sql", "")
	role := new(core.Role)
	role.RoleName = "Test"
	role.RoleDescription = "test"
	role.RoleParentID = 3
	err := role.Create()

	// test := core.History{}
	// fmt.Println(test)
	// fmt.Println(test.ActivityType)
	// path := dependency.Get_Parent_Path() + "Aldi Mulyawan.jpg"
	// file, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println(file)
	// fmt.Println(path)
}
