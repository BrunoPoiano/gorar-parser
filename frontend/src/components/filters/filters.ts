import { saveDataToLocalStorage } from "../../helpers/localstorage"
import { CheckFiles } from "../../requests/file"
import { options } from "../store/filters"
import { filtersList } from "./filtersList"
import "./style.css"


export function Filters() {

    let items = ""

    filtersList.forEach((el) => {
        items += ` 
        <div class="switch-wrapper">
            <label for="${el.id}" class="switch">
                <input type="checkbox" id="${el.id}" />
                <span class="slider round"></span>
            </label>
            <span>${el.label}</span>
        </div>`
    })

    return `
    <div class="filters" id="filters">
        ${items}
     </div>
    `
}

export function setupFilters(resultDiv: HTMLDivElement) {
    for (const el of filtersList) {
        const element = document.querySelector<HTMLInputElement>(`#${el.id}`)

        if (!element) continue

        element.checked = options[el.id]
        element.addEventListener("change", async () => {
            options[el.id] = !options[el.id]
            saveDataToLocalStorage({ key: "filters", initialValue: options })
            await CheckFiles(resultDiv)
        })
    }
}