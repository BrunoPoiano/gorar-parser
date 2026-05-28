package parserController

import (
	"fmt"
	"io"
	"main/parsed"
	"net/http"
)

func PostParseFile(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Max-Age", "15")

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
