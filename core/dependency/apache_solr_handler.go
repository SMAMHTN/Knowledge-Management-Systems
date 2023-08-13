package dependency

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func SolrCallUpdate(apimethod string, SolrV2URL string, username string, password string, data interface{}) ([]byte, *http.Response, error) {
	reqheader := []ApiHeader{}
	headerconnection := ApiHeader{
		HeaderKey:   "Connection",
		HeaderValue: "keep-alive",
	}
	reqheader = append(reqheader, headerconnection)
	headerconnection = ApiHeader{
		HeaderKey:   "Content-Type",
		HeaderValue: "application/json",
	}
	reqheader = append(reqheader, headerconnection)
	payload, err := json.Marshal(data)
	if err != nil {
		log.Println("WARNING " + err.Error())
		log.Print(err)

		return nil, nil, err
	}
	resp, err := ApiCallWithBasicAuth(apimethod, SolrV2URL, username, password, payload, reqheader)
	if err != nil {
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return body, resp, err
		}
		return body, resp, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return body, resp, err
	}
	return body, resp, nil
}

func SolrCallUpdateFromJSONString(apimethod string, SolrV2URL string, username string, password string, data interface{}) ([]byte, *http.Response, error) {
	reqheader := []ApiHeader{}
	headerconnection := ApiHeader{
		HeaderKey:   "Connection",
		HeaderValue: "keep-alive",
	}
	reqheader = append(reqheader, headerconnection)
	headerconnection = ApiHeader{
		HeaderKey:   "Content-Type",
		HeaderValue: "application/json",
	}
	reqheader = append(reqheader, headerconnection)
	payload, err := json.Marshal(data)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return nil, nil, err
	}
	payloadstring := "[" + string(payload) + "]"
	payload = []byte(payloadstring)
	resp, err := ApiCallWithBasicAuth(apimethod, SolrV2URL, username, password, payload, reqheader)
	if err != nil {
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return body, resp, err
		}
		return body, resp, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return body, resp, err
	}
	return body, resp, nil
}

func SolrCallQuery(url string, username string, password string) ([]byte, *http.Response, error) {
	resp, err := ApiCallWithBasicAuth("GET", url, username, password, nil, nil)
	if err != nil {
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return body, resp, err
		}
		return body, resp, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return body, resp, err
	}
	return body, resp, nil
}
