package dependency

import (
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"
)

func Init_log(LogFile string, TimeZone string) (err error) {
	fmt.Println("---------------------------------------")
	fmt.Println("Preparing Logger")

	// Check if the log file exists at the provided path
	_, err = os.Stat(LogFile)
	if os.IsNotExist(err) {
		// If not found, try appending the LogFile to the parent path
		parent := Get_Parent_Path()
		LogFile = filepath.Join(parent, LogFile)
	}

	// Open the log file for writing
	file, err := os.OpenFile(LogFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Println("FATAL failed to open log file " + err.Error())
		return errors.New("failed to open log file: " + err.Error())
	}

	// Set up the multi-writer with error handling
	multiWriter := io.MultiWriter(file, os.Stdout)
	log.SetFlags(log.Llongfile)
	log.SetOutput(multiWriter)
	desiredTimezone, err := time.LoadLocation(TimeZone)
	if err != nil {
		log.Fatal(err)
	}

	// Example: Create a logger

	// Example: Log something with a timestamp in the desired timezone
	current := time.Now().In(desiredTimezone)
	a := fmt.Sprintf("%s ", current.Format("2006/01/02 15:04:05 MST"))
	log.SetPrefix(a)

	// Test log message

	fmt.Println("Logger at " + LogFile)
	fmt.Println("---------------------------------------")
	return nil
}
