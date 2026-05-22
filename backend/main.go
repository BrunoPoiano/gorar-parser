package main

import (
	"fmt"
	"log"
	parserController "main/controller"
	"net/http"
)

func main() {
	http.HandleFunc("/parse", parserController.PostParseFile)

	log.Fatal(http.ListenAndServe("0.0.0.0:3333", nil))
	fmt.Printf("Server on port 3333\n")
}
