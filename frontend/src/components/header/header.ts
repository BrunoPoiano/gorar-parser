import { Favicon } from "../svgs/favicon.ts/favicon"

export function Header() {
    const favicon = Favicon()

    return `
        <header>
            <h1>
            ${favicon}
            Gorar Parser</h1>
            <span>
                Compress any codebase to a rar file and turn it into a prompt-friendly text for LLMs
            </span>
        </header>
    `
}