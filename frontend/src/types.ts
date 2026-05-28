
export type Options = {
    remove_comments: boolean
    remove_empty_lines: boolean
    remove_directory: boolean
    remove_readme: boolean
}


export type FiltersList = {
    id: keyof Options
    label: string
}