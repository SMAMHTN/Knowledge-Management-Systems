package main

import (
	"kms"
)

// type test struct{
// 	field string
// 	query string
// }

func main() {
	// var a []test
	defer kms.Database.Close()
	kms.Test_api()
}
