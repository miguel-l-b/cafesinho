import { MessageReaction, PartialUser, User } from "discord.js"
import path from "path"
import { loadJson, setJson } from "../utils/json.controller"
import logs from "../utils/logs"

export function requireConfig() { 
    const data = loadJson(path.resolve("config", "conf.json"))
    return {
        data: data
    }
}

export async function HandleConfig(react: MessageReaction, user: User | PartialUser) {
    try {
        react.users.remove(user.id)
        let config = requireConfig().data
        const channel = react.message.channel
        if(react.emoji.name === "🪧") {
            config.type = "prefix"
            await channel.send(":pencil: Escreva o novo prefixo").catch(e => logs.warning("Action Config", react.emoji.name))
            setJson(path.resolve("config", "conf.json"), config)
        }
        if(react.emoji.name === "📜") {
            config.type = "rule"
            await channel.send(":pencil: Escreva o id da mensagem de regras")
            setJson(path.resolve("config", "conf.json"), config).catch(e => logs.warning("Action Config", react.emoji.name))
        }
        if(react.emoji.name === "📑") {
            config.type = "role"
            await channel.send(":pencil: Escreva os ids dos cargos\n> Separe os por espaços")
            setJson(path.resolve("config", "conf.json"), config).catch(e => logs.warning("Action Config", react.emoji.name))
        }
    } catch {
        logs.error("Action Config")
    }
}