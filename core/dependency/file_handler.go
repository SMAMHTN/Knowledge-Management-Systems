package dependency

import (
	"fmt"
	"io"
	"io/fs"
	"os"
	"path"
	"strings"
)

func FilepathToByteArray(RelPathNoSlash string) ([]byte, error) {
	var data []byte
	file, err := os.Open(RelPathNoSlash)
	if err != nil {
		return data, err
	}
	defer file.Close()
	data, err = io.ReadAll(file)
	if err != nil {
		return data, err
	}
	return data, err
}

func ByteArrayToFilepath(ByteArray []byte, RelPathNoSlash string, Permission int) error {
	err := os.WriteFile(RelPathNoSlash, ByteArray, fs.FileMode(Permission))
	return err
}

func CreateEmptyFileDuplicate(filepath string) (*os.File, string, error) {
	// separate the file extension from the filepath
	ext := path.Ext(filepath)
	base := strings.TrimSuffix(filepath, ext)

	i := 0
	for {
		_, err := os.Stat(filepath)
		if os.IsNotExist(err) {
			// file does not exist, create it
			file, err := os.Create(filepath)
			if err != nil {
				return file, filepath, err
			}
			return file, filepath, nil
		}
		i++
		filepath = fmt.Sprintf("%sDup%d%s", base, i, ext)
	}
}
