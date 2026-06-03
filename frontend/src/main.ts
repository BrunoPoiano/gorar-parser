import './style.css'
import { exportFile, FileInput, setupParser } from './components/fileInput/fileInput'
import { changeTheme, Footer } from './components/footer/footer'
import { Header } from './components/header/header'
import { Filters, setupFilters } from './components/filters/filters'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${Header()}
  ${Filters()}
  ${FileInput()}
  ${Footer()}
`


changeTheme(document.querySelector<HTMLInputElement>('#theme')!)
setupFilters()
setupParser(
  document.querySelector<HTMLInputElement>('#fileInput')!,
  document.querySelector<HTMLLabelElement>('#dropcontainer')!,
)
exportFile(
  document.querySelector<HTMLButtonElement>('#downloadCodeBase')!,
)
