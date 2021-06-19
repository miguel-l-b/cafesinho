import { Client, MessageReaction, PartialUser, TextChannel, User } from "discord.js";
import path from "path/posix";
import tellConfigProps from "../interfaces/tellConfig.interface";
import { loadJson, setJson } from "../utils/json.controller";

export function requiredTell() {
    const data: tellConfigProps = loadJson(path.resolve("config", "tell.json"))
    return {
        id: data.id,
        channelId: data.channelId,
        memberId: data.memberId,
        format: data.format,
        content: data.content
    }
}

export async function HandleTell(app: Client, react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    
    const data: tellConfigProps = loadJson(path.resolve("config", "tell.json"))
    const channel = react.message.guild?.channels.cache.find(e => e.id === data.channelId && e.type === "text")
    if(react.emoji.name === '📢'){
        const m = await channel.send(":bookmark_tabs: Infrome o título da Notificação | Anuncio")
        const newData: tellConfigProps = {
            id: m.id,
            channelId: m.channel.id,
            format: `${react.emoji.name}-title`,
            memberId: data.memberId,
        }
        setJson(path.resolve("config", "tell.json"), newData)
    }  
    if(react.emoji.name === '📜'){
        const m = await channel.send(":bookmark_tabs: Informe as Regras")
        const newData: tellConfigProps = {
            id: m?.id,
            channelId: m?.channel.id,
            format: `${react.emoji.name}-content`,
            memberId: data.memberId,
        }
        setJson(path.resolve("config", "tell.json"), newData)
    }
}