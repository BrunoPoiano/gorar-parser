import { getDataFromLocalStorage, saveDataToLocalStorage } from "../../helpers/localstorage"

export function Footer() {
  return `
    <footer>
  	    <span> ${new Date().getFullYear()} | Bruno |
			    <a href="https://github.com/BrunoPoiano/cv-maker">Source Code</a> |
          <label for="theme">
            <input type="checkbox" id="theme"  />
            Dark Mode
          </label>
        </span>
    </footer>
    `
}


export function changeTheme(themeInput: HTMLInputElement) {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = getDataFromLocalStorage({ key: "theme", initialValue: darkMode ? 'dark' : "light" })

  themeInput.checked = theme === "dark"
  themeInput.addEventListener("change", () => {
    saveDataToLocalStorage({ initialValue: themeInput.checked ? "dark" : "light", key: "theme" })
  })
}


