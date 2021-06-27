import { Client, Message } from "discord.js";
import { requiredTicket } from "../actions/ticket";
import requiredProps from "../interfaces/required.interface";
import logs from "../utils/logs";

export const required: requiredProps = {
    command: ["voicename", "channelname"],
    commandShort: ["voice", "name", "channel"],
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    try {
        const voice = msg.member?.voice.channel
        args.splice(0,1)
        if(!voice || requiredTicket().data.calls.findIndex(e=> e.channelID === voice.id) <= -1) return await msg.author.send(":yellow_circle: Você não está em uma call privada").catch(e=> logs.warning("Command VoiceName", "Send message"))
        if(!voice || requiredTicket().data.calls.findIndex(e=> e.memberID === msg.author.id) <= -1) return await msg.author.send(":yellow_circle: Esta Call não é sua").catch(e=> logs.warning("Command VoiceName", "Send message"))
        if(!args[0]) return await msg.author.send(":yellow_circle: Você esqueceu de colocar o novo **nome** da call").catch(e=> logs.warning("Command VoiceName", "Send message"))
        if(args[0].length > 20) return await msg.author.send(":yellow_circle: Você superou os 20 caracteres").catch(e=> logs.warning("Command VoiceName", "Send message"))
        await voice.setName(args[0]).catch(e=> logs.warning("Command VoiceName", "Set Name"))
    } catch(e) {
        logs.error("Command VoiceName", e)
    }
}