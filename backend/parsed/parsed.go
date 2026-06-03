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

var filesToIgnore = []string{
	"node_modules",
	"vendor",
	"__pycache__",
	".DS_Store",
	"/.git/",
	"/dist/",
	"package-lock.json",
	"bun.lock",
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

	var gitignore []string

	if options.RemoveGitIgnoreFiles {
		gitignore = findGitIgnore(items)
	}

	if !options.RemoveDirectory {
		file.WriteString("=== Directory structure ===\n")

		for _, item := range items.File {
			if item.FileInfo().IsDir() {
				continue
			}

			if options.RemoveDotFiles && strings.Contains(item.Name, "/.") {
				continue
			}

			if ignoreFile(gitignore, item.Name) {
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
		if item.FileInfo().IsDir() || strings.Contains(item.Name, "/.git/") {
			continue
		}

		if options.RemoveDotFiles && strings.Contains(item.Name, "/.") {
			continue
		}

		if ignoreFile(gitignore, item.Name) {
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

				if options.RemoveComments && isComment(line) {
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

func findGitIgnore(items *zip.ReadCloser) []string {

	gitignore := []string{}

	for _, item := range items.File {
		if item.FileInfo().IsDir() {
			continue
		}

		if strings.Contains(item.Name, ".gitignore") {

			itemOpened, err := item.Open()
			if err != nil {
				continue
			}

			data, err := io.ReadAll(itemOpened)
			if err != nil {
				continue
			}

			scanner := bufio.NewScanner(strings.NewReader(string(data)))

			for scanner.Scan() {
				line := (scanner.Text())

				if line == "" {
					continue
				}

				if isComment(line) {
					continue
				}

				gitignore = append(gitignore, line)
			}
		}
	}

	return gitignore
}

func ignoreFile(files []string, name string) bool {
	for _, item := range files {
		if strings.Contains(item, "*.") {
			file := strings.Split(item, "*")

			if strings.HasSuffix(name, file[1]) {
				println(file[1], name, strings.HasSuffix(name, file[1]))
				return strings.HasSuffix(name, file[1])
			}
			continue
		}

		if strings.HasSuffix(name, item) {
			return strings.Contains(name, item)
		}
	}

	for _, filesIgnore := range filesToIgnore {
		if strings.Contains(name, filesIgnore) {
			return true
		}
	}

	return false
}

func isComment(line string) bool {
	if len(line) > 2 {
		return comments[line[:2]]
	}

	for comment := range comments {
		if strings.HasPrefix(line, comment) {
			return true
		}
	}

	return false
}
