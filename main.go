package main

import (
	"os"
	"strings"
	"unicode/utf8"

	"github.com/gen2brain/go-unarr"
)

func main() {
	rarFile, err := unarr.NewArchive("./tests/golendar.zip")
	if err != nil {
		panic(err)
	}
	defer rarFile.Close()

	list, err := rarFile.List()
	if err != nil {
		panic(err)
	}

	file, err := os.Create("file.txt")
	if err != nil {
		panic(err)
	}

	file.WriteString("=== Directory structure ===\n")

	defer file.Close()
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

				file.WriteString(line + "\n")
			}
		}
	}
}
