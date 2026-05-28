package parserController

import (
	"fmt"
	"main/parsed"
	"mime/multipart"
	"strconv"
)

func parseUrlValues(multipart *multipart.Form) (*multipart.FileHeader, parsed.ParsedOptions, error) {

	options := parsed.ParsedOptions{
		RemoveComments:   false,
		RemoveEmptyLines: false,
		RemoveDirectory:  false,
		RemoveReadMe:     false,
	}
	files := multipart.File["file"]

	if len(files) == 0 {
		return nil, options, fmt.Errorf("No files uploaded")
	}

	values := multipart.Value["remove_comments"]
	if len(values) > 0 {
		remove_comments, err := strconv.ParseBool(values[0])
		if err != nil {
			return nil, options, fmt.Errorf("invalid remove_comments")
		}

		options.RemoveComments = remove_comments
	}

	values = multipart.Value["remove_empty_lines"]
	if len(values) > 0 {
		remove_empty_lines, err := strconv.ParseBool(values[0])
		if err != nil {
			return nil, options, fmt.Errorf("invalid remove_empty_lines")
		}

		options.RemoveEmptyLines = remove_empty_lines
	}

	values = multipart.Value["remove_directory"]
	if len(values) > 0 {
		remove_directory, err := strconv.ParseBool(values[0])
		if err != nil {
			return nil, options, fmt.Errorf("invalid remove_directory")
		}

		options.RemoveDirectory = remove_directory
	}

	values = multipart.Value["remove_readme"]
	if len(values) > 0 {
		remove_readme, err := strconv.ParseBool(values[0])
		if err != nil {
			return nil, options, fmt.Errorf("invalid remove_readme")
		}

		options.RemoveReadMe = remove_readme
	}

	return files[0], options, nil

}
