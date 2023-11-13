package main

import (
	"kms"
)

func main() {
	defer kms.Database.Close()
	defer kms.Logger.Sync()
	defer kms.Logger.Info("KMS SERVER STOPPED")
	kms.Logger.Info("KMS SERVER STARTED")
	kms.Test_api()
}
