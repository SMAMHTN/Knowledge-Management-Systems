package dependency

import (
	"io"
	"net/http"
)

func GetTextTika(tikaURL string, FilePath string) (string, *http.Response, error) {
	// URL for the Tika server

	// Read the file to be extracted
	fileData, err := FilepathToByteArray(FilePath)
	if err != nil {

		return "", nil, err
	}

	// Create a new HTTP request

	// Set the Content-Type header
	// req.Header.Set("Content-Type", "application/pdf")
	reqheader := []ApiHeader{}
	headerconnection := ApiHeader{
		HeaderKey:   "Accept",
		HeaderValue: "text/plain",
	}
	reqheader = append(reqheader, headerconnection)

	// Create a new HTTP client and execute the request
	resp, err := ApiCall("PUT", tikaURL, fileData, reqheader)
	if err != nil {

		return "", nil, err
	}
	defer resp.Body.Close()

	// for key, values := range resp.Header {
	// 	for _, value := range values {
	// 		fmt.Printf("%s: %s\n", key, value)
	// 	}
	// }
	// time.Sleep(time.Minute)
	body, err := io.ReadAll(resp.Body)
	if err != nil {

		return "", nil, err
	}
	return string(body), resp, nil
}
