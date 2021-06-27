import { Client, Message } from "discord.js"
import path from "path"
import { requiredTicket } from "../actions/ticket"
import requiredProps from "../interfaces/required.interface"
import { setJson } from "../utils/json.controller"
import logs from "../utils/logs"

export const required: requiredProps = {
    command: ["invite", "convite"],
    commandShort: ["inv"],
    permission: ["SEND_MESSAGES"]
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    try {
    const voice = msg.member?.voice.channel
    if(!voice || requiredTicket().data.calls?.findIndex(e=> e.channelID === voice.id && e.memberID === msg.author.id) <= -1) return msg.author.send(":yellow_circle: Você não está em uma call privada de sua propriedade")
    const invite = await voice.createInvite()
    const members = msg.mentions.members
    const newTicket = requiredTicket().data
    const index = requiredTicket().data.calls?.findIndex(e=> e.channelID === voice.id)
    if(!members || members.size <= 0) return msg.author.send(":yellow_circle: Você não **marcou**, para quem eu envio o convite?")
    members?.map(async e => {
            voice.setPosition(1)
            if(newTicket.calls[index].perm.findIndex(e=> e.id === e.id) > -1) {
                voice.overwritePermissions([...newTicket.calls[index].perm, { id: e.id, allow:["VIEW_CHANNEL", "CONNECT"] }])
                newTicket.calls[index].perm = [...newTicket.calls[index].perm, { id: e.id, allow:["VIEW_CHANNEL", "CONNECT"] }]
                setJson(path.resolve("config", "ticket.json"), newTicket)
            }
            await msg.guild?.members.cache.get(e.id)?.send(`o \`@${msg.author.username}\` está te convidando para uma call privada,\n> ${invite}`).catch(e => e)
        })
    } catch(e) {
        logs.error("Command Invite", e)
    }
}