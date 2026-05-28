package parserController

import (
	"fmt"
	"io"
	"main/parsed"
	"net/http"
)

var allowedOrigins = map[string]bool{
	"http://0.0.0.0:3333":   true,
	"http://0.0.0.0:5173":   true,
	"http://localhost:5173": true,
	"http://localhost:3333": true,
}

func PostParseFile(w http.ResponseWriter, r *http.Request) {

	origin := r.Header.Get("Origin")

	if allowedOrigins[origin] {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")
	}

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Unable to parse file", http.StatusBadRequest)
		return
	}

	file, options, err := parseUrlValues(r.MultipartForm)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	parsedFile, err := parsed.Parsed(file, options)
	if err != nil {
		http.Error(w, "Error processing file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, parsedFile.Name()))
	defer parsedFile.Close()

	io.Copy(w, parsedFile)
}
