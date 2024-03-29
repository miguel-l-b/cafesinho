import { Client, Message } from "discord.js"
import requiredProps from "../interfaces/required.interface"
import logs from "../utils/logs"

export const required: requiredProps = {
    command: ["clear"],
    commandShort: ["cls", "cl"],
    dmChannel: false,
    permission: "MANAGE_MESSAGES"
}

export async function HandleCommand(_app: Client, msg: Message, args: string[]) {
    try {
        if(msg.channel.type === "dm") return
        if(!args[0] || parseInt(args[0]) <= 0)
            return await msg.channel.send(':face_with_monocle: | Quantas? \n > :tools: | `&clear <1-100>`')

        if(parseInt(args[0]) > 100) 
            return await msg.channel.send(':x: | Opss... \n > :tools: | `&clear <1-100>`')

        const deleteAmount = parseInt(args[0])
        msg.channel.bulkDelete(deleteAmount,true).catch(e => logs.error("Command Clear", "erro no ato de limpar as mensagens"))
    }catch {
        logs.error("Command Clear")
    }
}