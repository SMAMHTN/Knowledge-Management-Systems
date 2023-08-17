package dependency

import (
	"time"
)

func GetTime(TimeZone string) (time.Time, error) {
	var timenow time.Time
	var err error
	loc, err := time.LoadLocation(TimeZone)
	if err != nil {

		return timenow, err
	}
	timenow = time.Now().UTC().In(loc)
	return timenow, nil
}
