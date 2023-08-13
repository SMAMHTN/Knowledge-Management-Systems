package dependency

import (
	"errors"
	"fmt"
	"os"
)

func Init_log(LogFile string) (err error) {
	file, err := os.Open(LogFile)
	if err != nil {
		parent := Get_Parent_Path()
		path := parent + LogFile
		file, err = os.Open(path)
		if err != nil {
			return errors.New("conf file not found")
		}
	}
	fmt.Println(file)
	return nil
}
