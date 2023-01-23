package core

import (
	"encoding/json"
	"fmt"
	"os"
	// "reflect"
)

const Appname = "core"

type Configuration struct {
	Db_link     string
	Db_username string
	Db_password string
}

func fixpath(path string) string {
	if path[len(path)-1:] != "/" {
		path = path + "/"
	}
	return path
}

func Get_Parent_Path() string {
	parent, a := os.Getwd()
	if a != nil {
		panic(a)
	}
	parent = fixpath(parent)
	return parent
}

func Read_conf() Configuration {
	parent := Get_Parent_Path()
	path := parent + "core_conf.json"
	file, _ := os.Open(path)
	defer file.Close()
	decoder := json.NewDecoder(file)
	Configuration := Configuration{}
	err := decoder.Decode(&Configuration)
	if err != nil {
		fmt.Println("error:", err)
	}
	return Configuration
}
