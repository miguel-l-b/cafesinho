import fs from "fs"
import logs from "./logs"

export function loadJson(file: string) {
    try {
    const buffer = fs.readFileSync(file, 'utf-8')
    const contentJson = JSON.parse(buffer)

    return contentJson
    } catch(e) {
        logs.warning("loadJson", e)
    }
}

export function setJson(file: string, json: any) {
    fs.writeFileSync(file, JSON.stringify(json))
    return loadJson(file)
}