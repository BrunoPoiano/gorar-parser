package parsed

import (
	"errors"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"

	"github.com/gen2brain/go-unarr"
)

var comments = map[string]bool{
	"##": true,
	"# ": true,
	"//": true,
}

func Parsed(multipartFile *multipart.FileHeader) (*os.File, error) {

	fileName := string(multipartFile.Filename)
	if filepath.Ext(fileName) != ".zip" {
		return nil, errors.New("file is not a zip archive")
	}

	mFile, err := multipartFile.Open()
	if (err) != nil {
		return nil, err
	}

	defer mFile.Close()

	rarFile, err := unarr.NewArchive("./tests/golendar.zip")
	if err != nil {
		panic(err)
	}
	defer rarFile.Close()

	list, err := rarFile.List()
	if err != nil {
		panic(err)
	}

	name := strings.TrimSuffix(fileName, ".zip")
	file, err := os.Create(name + ".txt")
	if err != nil {
		panic(err)
	}

	file.WriteString("=== Directory structure ===\n")

	for _, item := range list {

		data, err := rarFile.ReadAll()
		if err != nil {
			panic(err)
		}

		if strings.Contains(item, "/.") || !utf8.ValidString(string(data)) {
			continue
		}
		file.WriteString(item + "\n")
	}

	for _, item := range list {
		if strings.Contains(item, "/.git") {
			continue
		}

		err := rarFile.EntryFor(item)
		if err != nil {
			panic(err)
		}

		data, err := rarFile.ReadAll()
		if err != nil {
			panic(err)
		}

		if utf8.ValidString(string(data)) {
			file.WriteString("\n=== " + item + " ===\n")

			for _, line := range strings.Split(string(data), "\n") {
				if line == "" {
					continue
				}

				comment_chars := []rune(line)

				if _, ok := comments[string(comment_chars[:2])]; ok {
					continue
				}

				file.WriteString(line + "\n")
			}
		}
	}

	return file, nil
}
