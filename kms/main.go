package main

import (
	"dependency"
	"encoding/json"
	"fmt"
)

// type test struct{
// 	field string
// 	query string
// }

func main() {
	// var a []test
	// defer kms.Database.Close()
	// defer kms.Logger.Sync()
	// defer kms.Logger.Info("KMS SERVER STOPPED")
	// kms.Logger.Info("KMS SERVER STARTED")
	// kms.Test_api()
	a := dependency.SortType{
		Field:     "asdasd",
		Ascending: false,
	}
	b := []dependency.WhereType{{
		Field:    "vxczv",
		Operator: "jhksd",
		Logic:    "iopi",
		Values:   []interface{}{},
	}}
	c, err := json.Marshal(a)
	if err != nil {
		fmt.Println(err)
	}
	d, err := json.Marshal(b)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(c))
	fmt.Println(string(d))
}
