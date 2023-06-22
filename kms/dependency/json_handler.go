package dependency

import "encoding/json"

func MapToJson(data map[string]interface{}) (string, error) {
	Jsondata, err := json.Marshal(data)
	return string(Jsondata), err
}

func JsonToMap(data string) (map[string]interface{}, error) {
	var MapData map[string]interface{}
	err := json.Unmarshal([]byte(data), &MapData)
	return MapData, err
}
