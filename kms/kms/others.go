package kms

import (
	"dependency"
	"time"
)

func GetTime() time.Time {
	outputTime, _ := dependency.GetTime("Asia/Jakarta")
	return outputTime
}