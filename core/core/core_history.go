package core

import (
	t "time"
)

type History struct {
	HistoryID          int
	ActivityType        string
	Time	t.Time //FIX
	UserID int
	Name string
	Changes string
	IPAddress string
}