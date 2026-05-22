package parserController

import (
	"fmt"
	"io"
	"main/parsed"
	"net/http"
)

func PostParseFile(w http.ResponseWriter, r *http.Request) {

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Unable to parse file", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["file"]

	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	file, err := parsed.Parsed(files[0])
	if err != nil {
		http.Error(w, "Error processing file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	defer file.Close()

	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, file.Name()))

	io.Copy(w, file)
}
