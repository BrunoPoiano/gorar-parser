
import { CheckFiles } from '../../requests/file'
import { files } from '../store/file'
import './style.css'

export function FileInput() {
    return `
    <div class="wrapper">
        <label for="fileInput" class="drop-container" id="dropcontainer">
        <span class="drop-title">Drop files here</span>
        <small>or</small>
        <input type="file" accept=".zip" id="fileInput" required>
        </label>
        <code id="resultDiv"></code>
        <button id="downloadCodeBase">Download</button>
    </div>
    `
}

export function exportFile(downloadButton: HTMLButtonElement, resultDiv: HTMLDivElement) {

    downloadButton.addEventListener("click", () => {
        const blob = new Blob([resultDiv.innerHTML, null], {
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

export async function setupParser(fileInput: HTMLInputElement, dropContainer: HTMLLabelElement, resultDiv: HTMLDivElement) {

    dropContainer.addEventListener("dragover", (e) => e.preventDefault(), false)
    dropContainer.addEventListener("dragenter", () => dropContainer.classList.add("drag-active"))
    dropContainer.addEventListener("dragleave", () => dropContainer.classList.remove("drag-active"))

    dropContainer.addEventListener("drop", async (e) => {
        e.preventDefault()
        dropContainer.classList.remove("drag-active")
        fileInput.files = e.dataTransfer.files
        files.value = e.dataTransfer.files
        await CheckFiles(resultDiv)
    })

    fileInput.addEventListener('change', async () => {
        files.value = fileInput.files
        await CheckFiles(resultDiv)
    })
}

