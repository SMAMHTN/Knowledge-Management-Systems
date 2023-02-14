package dependency

import (
	"io"
	"io/fs"
	"os"
)

func FilepathToByteArray(RelPathNoSlash string) ([]byte, error) {
	var data []byte
	file, err := os.Open(RelPathNoSlash)
	defer file.Close()
	if err != nil {
		return data, err
	}
	data, err = io.ReadAll(file)
	return data, err
}

func ByteArrayToFilepath(ByteArray []byte, RelPathNoSlash string, Permission int) error {
	err := os.WriteFile(RelPathNoSlash, ByteArray, fs.FileMode(Permission))
	return err
}
