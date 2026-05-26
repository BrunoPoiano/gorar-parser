
type LocalStorageProps<T> = {
    key: string
    initialValue: T
}

type GetDataProps<T> = LocalStorageProps<T> & {
    parseFunction?: (value: unknown) => T
}

export function getDataFromLocalStorage<T>({
    key,
    parseFunction,
    initialValue
}: GetDataProps<T>): T {
    const item = window.localStorage.getItem(key)

    if (item) {
        try {
            const parsed = JSON.parse(item)
            return parseFunction ? parseFunction(parsed) : parsed
        } catch {
            return item as T
        }
    }

    window.localStorage.setItem(key, JSON.stringify(initialValue))

    return initialValue
}

export function saveDataToLocalStorage<T>({
    key,
    initialValue
}: LocalStorageProps<T>) {
    window.localStorage.setItem(key, JSON.stringify(initialValue))
}
