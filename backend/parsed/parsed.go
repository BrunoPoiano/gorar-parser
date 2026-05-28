package parsed

import (
	"archive/zip"
	"bufio"
	"errors"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

var comments = map[string]bool{
	"##": true,
	"# ": true,
	"//": true,
}

func Parsed(multipartFile *multipart.FileHeader, options ParsedOptions) (*os.File, error) {

	fileName := string(multipartFile.Filename)
	if filepath.Ext(fileName) != ".zip" {
		return nil, errors.New("file is not a zip archive")
	}

	src, err := multipartFile.Open()
	if (err) != nil {
		return nil, err
	}

	tmpZip, err := os.CreateTemp("", "*.zip")
	if (err) != nil {
		return nil, err
	}
	defer os.Remove(tmpZip.Name())

	_, err = io.Copy(tmpZip, src)
	if err != nil {
		return nil, err
	}
	defer tmpZip.Close()

	items, err := zip.OpenReader(tmpZip.Name())
	if err != nil {
		return nil, err
	}
	defer items.Close()

	name := strings.TrimSuffix(fileName, ".zip")
	file, err := os.CreateTemp("", name+"-*.txt")
	if err != nil {
		panic(err)
	}

	if !options.RemoveDirectory {
		file.WriteString("=== Directory structure ===\n")

		for _, item := range items.File {
			if item.FileInfo().IsDir() || strings.Contains(item.Name, "/.") {
				continue
			}

			_, err = file.WriteString(item.Name + "\n")
			if err != nil {
				file.Close()
				return nil, err
			}
		}
	}

	for _, item := range items.File {
		if item.FileInfo().IsDir() || strings.Contains(item.Name, "/.") {
			continue
		}

		itemOpened, err := item.Open()
		if err != nil {
			file.Close()
			return nil, err
		}

		func() {
			defer itemOpened.Close()

			data, err := io.ReadAll(itemOpened)
			if err != nil {
				return
			}

			if !utf8.Valid(data) {
				return
			}

			for _, b := range data {
				if b == 0 {
					return
				}
			}

			if options.RemoveReadMe && (strings.Contains(item.Name, "readme") || strings.Contains(item.Name, "README")) {
				return
			}

			_, err = file.WriteString("\n=== " + item.Name + " ===\n")
			if err != nil {
				return
			}

			scanner := bufio.NewScanner(strings.NewReader(string(data)))

			for scanner.Scan() {
				line := (scanner.Text())

				if options.RemoveEmptyLines && line == "" {
					continue
				}

				if options.RemoveComments && (strings.HasPrefix(line, "//") ||
					strings.HasPrefix(line, "# ") ||
					strings.HasPrefix(line, "##")) {
					continue
				}

				_, err = file.WriteString(line + "\n")
				if err != nil {
					return
				}
			}
		}()

	}

	_, err = file.Seek(0, 0)
	if err != nil {
		file.Close()
		return nil, err
	}
	return file, nil
}
