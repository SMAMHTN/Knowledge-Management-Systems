package setup

import (
	"encoding/json"
	"fmt"
	"os"
	// "reflect"
)

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

func Read_conf() Configuration {
	parent, a := os.Getwd()
	fmt.Println(parent)
	if a != nil {
		panic(a)
	}
	parent = fixpath(parent)
	path := parent + "core_conf.json"
	fmt.Println(path)
	file, _ := os.Open(path)
	defer file.Close()
	decoder := json.NewDecoder(file)
	Configuration := Configuration{}
	err := decoder.Decode(&Configuration)
	if err != nil {
		fmt.Println("error:", err)
	}
	fmt.Println(Configuration.Db_link) // output: [UserA, UserB]
	// fmt.Println(reflect.TypeOf(configuration))
	return Configuration
}

func (c *Configuration) GetLink() string {
	return c.Db_link
}
