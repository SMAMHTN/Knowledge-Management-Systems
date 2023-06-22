package dependency

import (
	"errors"
	"fmt"
)

func InterfaceToInt(val interface{}) (int, error) {
	switch val := val.(type) {
	case int:
		return int(val), nil
	case int64:
		return int(val), nil
	case int32:
		return int(val), nil
	case float64:
		return int(val), nil
	case float32:
		return int(val), nil
	default:
		fmt.Printf("Failed to convert this interface type %T to integer (Package dependency : interfacehandler.go)", val)
		return 0, errors.New("convert failed: failed to convert interface to int")
	}
}

func InterfaceToString(input interface{}) (string, error) {
	str, ok := input.(string)
	if !ok {
		return "", fmt.Errorf("input is not a string")
	}
	return str, nil
}

func SliceInterfaceToInt(data []interface{}) ([]int, error) {
	result := make([]int, len(data))
	for i, val := range data {
		switch val := val.(type) {
		case int:
			result[i] = val
		case int64:
			result[i] = int(val)
		case int32:
			result[i] = int(val)
		case float64:
			result[i] = int(val)
		case float32:
			result[i] = int(val)
		default:
			fmt.Printf("Failed to convert this interface type %T to integer (Package dependency : interfacehandler.go)", val)
			return result, errors.New("convert failed: failed to convert interface to int")
		}
	}
	return result, nil
}
