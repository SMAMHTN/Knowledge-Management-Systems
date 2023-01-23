package main

import (
	"fmt"
	"setup"
)

func main() {
	conf := setup.Read_conf()
	fmt.Printf(conf.Db_link)
}
