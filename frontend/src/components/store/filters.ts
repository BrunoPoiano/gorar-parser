import { getDataFromLocalStorage } from "../../helpers/localstorage";
import type { Options } from "../../types";

export const options: Options = getDataFromLocalStorage({
    key: "filters",
    initialValue: {
        remove_comments: false,
        remove_empty_lines: false,
        remove_directory: false,
        remove_readme: false,
        remove_dot_files: true,
        remove_gitignore_files: true,
    }
})