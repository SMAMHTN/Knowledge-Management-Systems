package main

import (
	"core"
)

func main() {
	// a := dependency.GetFieldNames(core.User_API{})
	// fmt.Println(a)
	defer core.Database.Close()
	defer core.Logger.Sync()
	defer core.Logger.Info("CORE SERVER STOPPED")
	defer core.Logger.Info("CORE SERVER STARTED")
	core.Test_api()
}
