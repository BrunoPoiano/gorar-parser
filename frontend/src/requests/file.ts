import { files } from "../components/store/file";
import { options } from "../components/store/filters";
import type { Options } from "../types";

export async function CheckFiles(resultDiv: HTMLDivElement) {

    if (!files.value || files.value.length === 0) {
        return
    }

    const value = await SendFile(files.value[0], options)

    resultDiv.innerHTML = value ? value : ""
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
        .catch(_ => "Error parsing file");
}

