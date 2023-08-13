package dependency

import (
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
)

func CheckStringArray(data string) bool {
	return data[0] == '[' && data[len(data)-1] == ']'
}

func ConvStringToStringArray(data string) (result []string, err error) {
	if !CheckStringArray(data) {
		return nil, errors.New("this isnt an array")
	}
	splitStr := strings.Split(data[1:len(data)-1], ",")
	for count, x := range splitStr {
		if x != "" {
			if err != nil {
				log.Printf("WARNING index : %d with value %s not detected as string with error : %s", count, strings.ToLower(x), err.Error())
				return nil, fmt.Errorf("index : %d with value %s not detected as string with error : %s", count, strings.ToLower(x), err.Error())
			}
			result = append(result, x)
		}
	}
	return result, err
}

func ConvStringToIntArray(data string) (result []int, err error) {
	StringArray, err := ConvStringToStringArray(data)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}
	for count, x := range StringArray {
		if x != "" {
			y64, err := strconv.ParseInt(x, 10, 0)
			y := int(y64)
			if err != nil {
				log.Printf("WARNING index : %d with value %s not detected as integer with error : %s", count, strings.ToLower(x), err.Error())
				return nil, fmt.Errorf("index : %d with value %s not detected as integer with error : %s", count, strings.ToLower(x), err.Error())
			}
			result = append(result, y)
		}
	}
	return result, nil
}

func ConvStringToStringArrayUnique(data string) (result []string, err error) {
	TmpStringArrayUnique := make(map[string]bool)
	StringArray, err := ConvStringToStringArray(data)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}
	for _, x := range StringArray {
		TmpStringArrayUnique[x] = false
	}
	for k := range TmpStringArrayUnique {
		result = append(result, k)
	}
	return result, nil
}
