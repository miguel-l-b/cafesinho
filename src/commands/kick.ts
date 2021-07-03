import { Client, Message } from "discord.js"
import path from "path"
import { requiredTicket } from "../actions/ticket"
import requiredProps from "../interfaces/required.interface"
import { setJson } from "../utils/json.controller"
import logs from "../utils/logs"

export const required: requiredProps = {
    command: ["kick", "kill", "remove"],
    commandShort: ["rm"],
    permission: ["SEND_MESSAGES"]
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    try {
    const voice = msg.member?.voice.channel
    if(!voice || requiredTicket().data.calls?.findIndex(e=> e.channelID === voice.id && e.memberID === msg.author.id) <= -1) return msg.author.send(":yellow_circle: Você não está em uma call privada de sua propriedade")
    const members = msg.mentions.members
    const newTicket = requiredTicket().data
    const index = requiredTicket().data.calls?.findIndex(e=> e.channelID === voice.id)
    if(!members || members.size <= 0) return msg.author.send(":yellow_circle: Você não **marcou**, para quem eu envio o convite?")
    members?.map(async member => {
            const inID = newTicket.calls[index].perm.findIndex(e=> e.id === member.id)
            newTicket.calls[index].perm.splice(inID, 1)
            voice.overwritePermissions([...newTicket.calls[index].perm])
            setJson(path.resolve("config", "ticket.json"), newTicket)
        })
    } catch(e) {
        logs.error("Command Invite", e)
    }
}