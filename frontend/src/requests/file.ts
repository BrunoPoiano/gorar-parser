import { fileParsed, files, } from "../components/store/constants";
import { options } from "../components/store/filters";

let timeoutId: number | undefined = undefined

export async function debouncedCheckFiles(delay = 500) {

    const resultDiv = document.querySelector<HTMLDivElement>("#resultDiv")
    const resultCode = document.querySelector<HTMLDivElement>("#resultCode")

    if (!resultCode || !resultDiv) {
        return
    }

    resultDiv.classList.add("loading")

    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
        await CheckFiles(resultCode, resultDiv)
    }, delay);
}

async function CheckFiles(resultCode: HTMLDivElement, resultDiv: HTMLDivElement) {

    if (!files.value || files.value.length === 0) {
        return
    }

    const value = await SendFile(files.value[0])

    fileParsed.value = value
    resultDiv.classList.remove("loading")
    resultCode.innerHTML = value ? value : ""
    document.querySelector<HTMLButtonElement>('#downloadCodeButton')?.removeAttribute("disabled")
}

async function SendFile(file: File) {

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    for (const el of Object.entries(options)) {
        bodyFormData.append(el[0], el[1].toString())
    }

    return await fetch(`http://${window.location.hostname}:4747/parse`, {
        method: "POST",
        body: bodyFormData
    }).then(response => response.text())
        .then(data => data)
        .catch(_ => "Error parsing file")

}
