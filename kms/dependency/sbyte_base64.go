package dependency

import (
	"encoding/base64"
	"log"
)

func BytesToBase64(data []byte) string {
	res := base64.StdEncoding.EncodeToString(data)
	return res
}

func Base64ToBytes(data string) ([]byte, error) {
	res, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}
	return res, nil
}
