import { Client, MessageReaction, PartialUser, User } from "discord.js";
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
    const guild = app.guilds.cache.get('838839610300694579')
    const channel = guild?.channels.cache.find(e => e.id === data.channelId)
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
}