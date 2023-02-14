package main

import (
	"core"
	"dependency"
	"fmt"
	// "setup"
)

func main() {
	// err := db.Execute_sql_file("core_nofk.sql", "")
	// role := new(core.Role)
	// role.RoleName = "Test"
	// role.RoleDescription = "test"
	// role.RoleParentID = 3
	// err := role.Create()

	// test := core.History{}
	// fmt.Println(test)
	// fmt.Println(test.ActivityType)
	var err error
	setting := core.Setting{CompanyID: 1}
	err = setting.Delete()
	// setting.CompanyName = "test edited bro"
	// err = setting.Update()
	// setting := core.Setting{
	// 	CompanyName:    "test",
	// 	CompanyAddress: "Test Address",
	// 	TimeZone:       "Test",
	// 	AppthemeID:     1}
	// setting.CompanyLogo, err = dependency.FilepathToByteArray("Aldi Mulyawan.jpg")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// err = setting.Create()
	if err != nil {
		fmt.Println(err)
	}
	err = dependency.ByteArrayToFilepath(setting.CompanyLogo, "test.jpg", 0777)
}
