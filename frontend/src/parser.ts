export async function setupParser(element: HTMLInputElement, resultDiv: HTMLDivElement) {
  element.addEventListener('change', async () => {

    if (!element.files || element.files.length === 0) {
      return
    }

    const value = await SendFile(element.files[0])

    resultDiv.innerHTML = value ? value : ""
  })
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