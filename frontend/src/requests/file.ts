import { fileParsed, files, } from "../components/store/constants";
import { options } from "../components/store/filters";
import type { Options } from "../types";

let timeoutId: number | null = null

export async function debouncedCheckFiles(delay = 500) {

    const resultCode = document.querySelector<HTMLDivElement>("#resultCode")
    const resultContent = document.querySelector<HTMLDivElement>("#resultContent")

    if (!resultCode || !resultContent) {
        return
    }

    resultContent.classList.add("loading")

    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
        await CheckFiles(resultCode, resultContent)
    }, delay);
}

async function CheckFiles(resultCode: HTMLDivElement, resultContent: HTMLDivElement) {

    if (!files.value || files.value.length === 0) {
        return
    }

    const value = await SendFile(files.value[0], options)

    fileParsed.value = value
    resultContent.classList.remove("loading")
    resultCode.innerHTML = value ? value : ""
}

async function SendFile(file: File, options?: Options) {

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    if (options) {
        for (const el of Object.entries(options)) {
            bodyFormData.append(el[0], el[1].toString())
        }
    }

    return await fetch(`http://${window.location.hostname}:4747/parse`, {
        method: "POST",
        body: bodyFormData
    }).then(response => response.text())
        .then(data => data)
        .catch(_ => "Error parsing file")

}

