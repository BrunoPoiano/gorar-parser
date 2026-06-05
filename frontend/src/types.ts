
const filterOptions = [
    "remove_comments",
    "remove_directory",
    "remove_empty_lines",
    "remove_readme",
    "remove_dot_files",
    "remove_gitignore_files"
] as const

type FilterOptions = typeof filterOptions[number]

export type Options = Record<FilterOptions, boolean>

export type FiltersList = { [T in FilterOptions]: {
    label: string
} }

