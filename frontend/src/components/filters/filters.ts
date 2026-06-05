import { saveDataToLocalStorage } from "../../helpers/localstorage"
import { debouncedCheckFiles } from "../../requests/file"
import type { FiltersList } from "../../types"
import { options } from "../store/filters"
import { filtersList } from "./filtersList"
import "./style.css"


export function Filters() {

    let items = ""

    for (const el of Object.entries(filtersList)) {
        items += ` 
        <div class="switch-wrapper">
            <label for="${el[0]}" class="switch">
                <input type="checkbox" id="${el[0]}" />
                <span class="slider round"></span>
            </label>
            <span>${el[1].label}</span>
        </div>`
    }

    return `
    <div class="filters" id="filters">
        ${items}
     </div>
    `
}

export function setupFilters() {
    for (const el of Object.entries(filtersList)) {
        const element = document.querySelector<HTMLInputElement>(`#${el[0]}`)

        if (!element) continue

        const id = el[0] as keyof FiltersList

        element.checked = options[id]
        element.addEventListener("change", async () => {
            options[id] = !options[id]
            saveDataToLocalStorage({ key: "filters", initialValue: options })
            await debouncedCheckFiles()
        })
    }
}