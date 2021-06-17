import fs from "fs"

export function loadJson(file: string) {
    const buffer = fs.readFileSync(file, 'utf-8')
    const contentJson = JSON.parse(buffer)

    return contentJson
}

export function setJson(file: string, json: any) {
    fs.writeFileSync(file, JSON.stringify(json))
    return loadJson(file)
}