package main

import (
	"dependency"
	"fmt"
)

func main() {
	a := dependency.ConvIntArrayToString([]int{})
	b, _ := dependency.ConvStringArrayToString([]string{})
	c := dependency.ConvIntArrayToString([]int{1, 2, 3, 4, 5})
	d, _ := dependency.ConvStringArrayToString([]string{"asd", "asda", "hj"})
	fmt.Println(a)
	fmt.Println(b)
	fmt.Println(c)
	fmt.Println(d)
}
