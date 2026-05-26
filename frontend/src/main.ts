import './style.css'
import { exportFile, FileInput, setupParser } from './components/fileInput/fileInput'
import { changeTheme, Footer } from './components/footer/footer'
import { Header } from './components/header/header'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${Header()}
  ${FileInput()}
  ${Footer()}
`


changeTheme(document.querySelector<HTMLInputElement>('#theme')!)
setupParser(document.querySelector<HTMLInputElement>('#fileInput')!, document.querySelector<HTMLLabelElement>('#dropcontainer')!, document.querySelector<HTMLDivElement>('#resultDiv')!)
exportFile(document.querySelector<HTMLButtonElement>('#downloadCodeBase')!, document.querySelector<HTMLDivElement>('#resultDiv')!)