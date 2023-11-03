package dependency

import "reflect"

func GetElementString(slice []string, index int) string {
	if index < len(slice) {
		return slice[index]
	}
	return ""
}

func CheckValueExistString(slice []string, value string) bool {
	for _, slicevalue := range slice {
		if slicevalue == value {
			return true
		}
	}
	return false
}

func BooltoInt(data bool) (res int) {
	if data {
		return 1
	} else {
		return 0
	}
}

func GetFieldNames(v interface{}) []string {
	var fieldNames []string
	val := reflect.ValueOf(v)

	for i := 0; i < val.NumField(); i++ {
		fieldNames = append(fieldNames, val.Type().Field(i).Name)
	}

	return fieldNames
}