package dependency

import "fmt"

func SQLArrayString(values []string) (res string) {
	res = "("
	for i, value := range values {
		res += value
		if i < len(values)-1 {
			res += ","
		}
	}
	res += ")"
	return res
}

func SQLArrayInt(values []int) (res string) {
	res = "("
	for i, value := range values {
		res += fmt.Sprintf("%d", value)
		if i < len(values)-1 {
			res += ","
		}
	}
	res += ")"
	return res
}
