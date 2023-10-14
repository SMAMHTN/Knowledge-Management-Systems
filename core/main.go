package main

import "core"

func main() {
	// a := dependency.GetFieldNames(core.User_API{})
	// fmt.Println(a)
	defer core.Database.Close()
	defer core.Logger.Sync()
	defer core.Logger.Info("CORE SERVER STOPPED")
	defer core.Logger.Info("CORE SERVER STARTED")
	core.Test_api()
	// a := []int{1, 2, 3, 4}
	// for x, y := range a {
	// 	fmt.Println(x)
	// 	fmt.Println(y)
	// 	fmt.Println("-----------------------------")
	// }
	// fmt.Println(a)
	// a[1] = 5
	// fmt.Println(a)
	// b := a[1:3]
	// fmt.Println(b)
	// b[0] = 8
	// fmt.Println(b)
	// fmt.Println(dependency.ConvIntArrayToString(a))
	// Field := "RoleParentName"
	// Field = Field[:4] + Field[10:]
	// fmt.Println(Field)
}
