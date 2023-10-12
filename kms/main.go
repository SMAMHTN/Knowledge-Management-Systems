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
	defer kms.Logger.Sync()
	defer kms.Logger.Info("KMS SERVER STOPPED")
	kms.Logger.Info("KMS SERVER STARTED")
	kms.Test_api()
}
