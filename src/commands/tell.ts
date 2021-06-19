import { Client, Message } from "discord.js"
import path from "path/posix"
import requiredProps from "../interfaces/required.interface"
import tellConfigProps from "../interfaces/tellConfig.interface"
import { setJson } from "../utils/json.controller"

export const required: requiredProps = {
    command: ["tell"],
    commandShort: ["t"],
    permission: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"]
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
        const m = await msg.channel.send(":speaking_head: | Vamos lá \n > :loudspeaker: Notificação | Anunciar (Embed) - :scroll: Regra (Embed) - :regional_indicator_e: Personalizado (Embed) - :regional_indicator_t: qualquer coisa (Text)")
        m.react('📢')
        m.react('📜')
        m.react('🇪')
        m.react('🇹')
        const data: tellConfigProps = {
            id: m.id,
            channelId: msg.channel.id,
            memberId: msg.author.id,
        }
        setJson(path.resolve("config", "tell.json"), data)
}