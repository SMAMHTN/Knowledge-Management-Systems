package main

import (
	"fmt"
	"kms"
	"time"
)

// type test struct{
// 	field string
// 	query string
// }

func main() {
	// var a []test
	a := kms.Article_Table{
		ArticleID:      0,
		OwnerID:        1,
		LastEditedByID: 1,
		LastEditedTime: time.Time{},
		Tag:            "a,b",
		Title:          "test",
		CategoryID:     1,
		Article:        "tes",
		FileID:         "",
		DocID:          "",
		IsActive:       1,
	}
	_, err := a.Create()
	if err != nil {
		fmt.Println(err)
	}
	defer kms.Database.Close()
	kms.Test_api()
}
