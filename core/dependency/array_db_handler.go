package dependency

import (
	"fmt"
	"strconv"
	"strings"
)

func ConvIntArrayToString(arr []int) string {
	// Convert the integer array to a string, joining elements with a delimiter
	str := ""
	for _, num := range arr {
		str += fmt.Sprintf("%d,", num)
	}
	// Remove the trailing comma
	str = strings.TrimRight(str, ",")
	return str
}

func ConvIntArrayToStringUnique(arr []int) (string, error) {
	// Convert the integer array to a string, joining elements with a delimiter
	seen := make(map[int]bool)
	str := ""
	for _, num := range arr {
		str += fmt.Sprintf("%d,", num)
		if seen[num] {
			return "", fmt.Errorf("duplicate integer found: %d", num)
		}
		seen[num] = true
	}
	// Remove the trailing comma
	str = strings.TrimRight(str, ",")
	return str, nil
}

func ConvStringToIntArray(str string) ([]int, error) {
	// Split the string by the delimiter and convert it back to an integer array
	strValues := strings.Split(str, ",")
	var intArray []int
	for _, strVal := range strValues {
		num := 0
		num, err := strconv.Atoi(strVal)
		if err != nil {
			return nil, err
		}
		intArray = append(intArray, num)
	}
	return intArray, nil
}

func ConvStringArrayToString(arr []string) (string, error) {
	for i, val := range arr {
		if strings.Contains(val, ",") {
			return "", fmt.Errorf("value at position %d contains a comma: %s", i, val)
		}
	}
	return strings.Join(arr, ","), nil
}

// stringToStringArray converts a single string back to an array of strings using a delimiter.
func ConvStringToStringArray(str string) []string {
	return strings.Split(str, ",")
}

func ConvStringArrayToStringUnique(arr []string) (string, error) {
	seen := make(map[string]bool)
	for i, val := range arr {
		if strings.Contains(val, ",") {
			return "", fmt.Errorf("value at position %d contains a comma: %s", i, val)
		}
		if seen[val] {
			return "", fmt.Errorf("duplicate value found: %s at position %d", val, i)
		}
		seen[val] = true
	}
	return strings.Join(arr, ","), nil
}
