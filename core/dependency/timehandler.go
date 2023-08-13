package dependency

import (
	"log"
	"time"
)

func GetTime(TimeZone string) (time.Time, error) {
	var timenow time.Time
	var err error
	loc, err := time.LoadLocation(TimeZone)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return timenow, err
	}
	timenow = time.Now().UTC().In(loc)
	return timenow, nil
}
