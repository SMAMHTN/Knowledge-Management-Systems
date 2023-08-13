package dependency

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ApiHeader struct {
	HeaderKey   string
	HeaderValue string
}

func ApiWithBasicAuthAndJSON(apimethod string, url string, username string, password string, data interface{}, Header []ApiHeader) (*http.Response, error) {
	// Encode data as JSON

	// jsonData, err := MapToJson(data)
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}

	// Create a new HTTP request with JSON data in the body
	req, err := http.NewRequest(apimethod, url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	for _, x := range Header {
		req.Header.Set(x.HeaderKey, x.HeaderValue)
	}

	// Set Basic Authentication header
	req.SetBasicAuth(username, password)

	// Send the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return resp, fmt.Errorf("HTTP request failed with status code %d", resp.StatusCode)
	}

	return resp, nil
}

func ApiCall(apimethod string, url string, data []byte, Header []ApiHeader) (*http.Response, error) {

	// Create a new HTTP request with JSON data in the body
	req, err := http.NewRequest(apimethod, url, bytes.NewBuffer(data))
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}
	for _, x := range Header {
		req.Header.Set(x.HeaderKey, x.HeaderValue)
	}

	// Send the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return resp, fmt.Errorf("HTTP request failed with status code %d", resp.StatusCode)
	}

	return resp, nil
}

func ApiCallWithBasicAuth(apimethod string, url string, username string, password string, data []byte, Header []ApiHeader) (*http.Response, error) {

	// Create a new HTTP request with JSON data in the body
	req, err := http.NewRequest(apimethod, url, bytes.NewBuffer(data))
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}
	for _, x := range Header {
		req.Header.Set(x.HeaderKey, x.HeaderValue)
	}

	req.SetBasicAuth(username, password)

	// Send the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, err
	}

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return resp, fmt.Errorf("HTTP request failed with status code %d", resp.StatusCode)
	}

	return resp, nil
}
