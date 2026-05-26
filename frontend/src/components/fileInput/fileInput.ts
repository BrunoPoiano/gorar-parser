
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

        const link = document.createElement('a')
        link.href = url
        link.download = `code_base_${new Date().toISOString()}.txt`
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
        await CheckFiles(e.dataTransfer.files, resultDiv)
    })

    fileInput.addEventListener('change', async () => await CheckFiles(fileInput.files, resultDiv))
}

async function CheckFiles(files: FileList | null, resultDiv: HTMLDivElement) {

    if (!files || files.length === 0) {
        return
    }

    const value = await SendFile(files[0])

    resultDiv.innerHTML = value ? value : ""
}

async function SendFile(file: File) {

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    return await fetch("http://localhost:3333/parse", {
        method: "POST",
        body: bodyFormData
    }).then(response => response.text())
        .then(data => data)
        .catch(error => "Error sending file:" + error);
}

