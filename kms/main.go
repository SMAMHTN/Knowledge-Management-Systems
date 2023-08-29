package main

import (
	"kms"
)

func main() {
	defer kms.Database.Close()
	kms.Test_api()
}
