package dependency

import (
	"errors"
	"fmt"
	"strings"
)

// import (
// 	"errors"
// 	"fmt"
// 	"strconv"
// 	"strings"
// )

func CheckStringArrayBracket(data string) bool {
	return data[0] == '[' && data[len(data)-1] == ']'
}

func ConvStringToStringArrayBracket(data string) (result []string, err error) {
	if !CheckStringArrayBracket(data) {
		return nil, errors.New("this isnt an array")
	}
	splitStr := strings.Split(data[1:len(data)-1], ",")
	for count, x := range splitStr {
		if x != "" {
			if err != nil {

				return nil, fmt.Errorf("index : %d with value %s not detected as string with error : %s", count, strings.ToLower(x), err.Error())
			}
			result = append(result, x)
		}
	}
	return result, err
}

// func ConvStringToIntArray(data string) (result []int, err error) {
// 	StringArray, err := ConvStringToStringArray(data)
// 	if err != nil {

// 		return nil, err
// 	}
// 	for count, x := range StringArray {
// 		if x != "" {
// 			y64, err := strconv.ParseInt(x, 10, 0)
// 			y := int(y64)
// 			if err != nil {
// 				return nil, fmt.Errorf("index : %d with value %s not detected as integer with error : %s", count, strings.ToLower(x), err.Error())
// 			}
// 			result = append(result, y)
// 		}
// 	}
// 	return result, nil
// }

func ConvStringToStringArrayUniqueBracket(data string) (result []string, err error) {
	TmpStringArrayUnique := make(map[string]bool)
	StringArray, err := ConvStringToStringArrayBracket(data)
	if err != nil {

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
