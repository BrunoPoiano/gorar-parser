package main

import (
	"log"
	parserController "main/controller/parse"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/parse", parserController.PostParseFile)
	mux.Handle("/", http.FileServer(http.Dir("./frontend/dist")))

	server := http.Server{
		Addr:    "0.0.0.0:4747",
		Handler: mux,
	}

	println("Server on port 4747")
	log.Fatal(server.ListenAndServe())
}
