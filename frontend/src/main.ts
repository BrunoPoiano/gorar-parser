import './style.css'
import { setupParser } from './parser'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Golang Parser</h1>
    <input id="inputFile" type="file" id="fileInput" />

  <code id="resultDiv">
  </code>

`
setupParser(document.querySelector<HTMLInputElement>('#inputFile')!, document.querySelector<HTMLDivElement>('#resultDiv')!)
