package main

import (
	"dependency"
	"fmt"
	"os"
	// "setup"
)

func main() {
	path := dependency.Get_Parent_Path() + "Aldi Mulyawan.jpg"
	file, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(file)
	fmt.Println(path)
}
