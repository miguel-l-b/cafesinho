import { Client, MessageReaction, PartialUser, User } from "discord.js"
import path from "path/posix"
import { loadJson, setJson } from "../utils/json.controller"

export function requiredNewChannel(id: string, member: string) {
    const data: Array<any> = loadJson(path.resolve("config", "newchannels.json"))
    if(data.findIndex(e => e.id === id && e.memberId === member) >= 0)
        return true
    else
        return false
}

export async function HandleNewChannel(app: Client, react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    const data: Array<any> = loadJson(path.resolve("config", "newchannels.json"))
    try {
        let type
        if(react.emoji.name === "📜") type = "text"
        if(react.emoji.name === "📢") type = "news"
        if(react.emoji.name === "📑") type = "category"
        if(react.emoji.name === "🎙️") type = "voice"
    
        const newCh = data.find(e => e.id === react.message.id && e.memberId === user.id)
        const guild = react.message.guild
        const newChannel = await guild?.channels.create(newCh.name, {
            parent: newCh.parent,
            type: type,
        })

        newChannel && setJson(path.resolve("config", "newchannels.json"), data.splice(data.findIndex(e => e.id === react.message.id && e.memberId === user.id), 0))
    } catch {
        setJson(path.resolve("config", "newchannels.json"), data.splice(data.findIndex(e => e.id === react.message.id && e.memberId === user.id), 0))
    }
}