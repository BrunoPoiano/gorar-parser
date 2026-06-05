
import { debouncedCheckFiles } from '../../requests/file'
import { fileParsed, files } from '../store/constants'
import './style.css'

export function FileInput() {
    return `
    <div class="wrapper">
        <label for="fileInput" class="drop-container" id="dropcontainer">
            <span class="drop-title">Drop files here</span>
            <small>or</small>
            <input type="file" accept=".zip" id="fileInput" required>
        </label>
        <button id="downloadCodeButton" disabled>Download</button>
    </div>
    <div id="resultDiv">
        <code id="resultCode"></code>
    </div>
    `
}

export function exportFile(downloadButton: HTMLButtonElement) {
    downloadButton.addEventListener("click", () => {

        if (!files || !files.value) {
            return
        }

        const blob = new Blob([fileParsed.value], {
            type: "text"
        })

        const url = URL.createObjectURL(blob)
        const name = files.value[0].name.replaceAll(" ", "_")
        const link = document.createElement('a')

        link.href = url
        link.download = `${name}_${new Date().toISOString()}.txt`
        link.click()

        URL.revokeObjectURL(url)
    })
}

export async function setupParser(fileInput: HTMLInputElement, dropContainer: HTMLLabelElement) {

    dropContainer.addEventListener("dragover", (e) => e.preventDefault(), false)
    dropContainer.addEventListener("dragenter", () => dropContainer.classList.add("drag-active"))
    dropContainer.addEventListener("dragleave", () => dropContainer.classList.remove("drag-active"))

    dropContainer.addEventListener("drop", async (e) => {
        e.preventDefault()
        dropContainer.classList.remove("drag-active")

        if (!e.dataTransfer) return

        fileInput.files, files.value = e.dataTransfer.files
        await debouncedCheckFiles()
    })

    fileInput.addEventListener('change', async () => {
        files.value = fileInput.files
        await debouncedCheckFiles()
    })
}

