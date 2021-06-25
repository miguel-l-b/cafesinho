import { Client, Message } from "discord.js"
import { requiredTicket } from "../actions/ticket"
import requiredProps from "../interfaces/required.interface"
import logs from "../utils/logs"

export const required: requiredProps = {
    command: ["invite", "convite"],
    commandShort: ["inv"],
    permission: ["SEND_MESSAGES"]
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    msg.delete().catch(e=> logs.warning("Command Invite", "delete message"))
    const voice = msg.member?.voice.channel
    if(!voice || requiredTicket().data.calls?.findIndex(e=> e.channelID === voice.id) <= -1) return msg.author.send(":yellow_circle: Você não está em uma call privada")
    const invite = await voice.createInvite()
    const members = msg.mentions.members
    if(!members || members.size <= 0) return msg.author.send(":yellow_circle: Você não **marcou**, para quem eu envio o convite?")
    members?.map(async e => {
            voice.setPosition(1)
            voice.permissionOverwrites.map(perm => voice.overwritePermissions([perm, { id: e.id, allow: ["VIEW_CHANNEL", "CONNECT"] }, { id: "838839610300694579", deny: ["VIEW_CHANNEL", "CONNECT"] }]))
            await msg.guild?.members.cache.get(e.id)?.send(`o \`@${msg.author.username}\` está te convidando para uma call privada,\n> ${invite}`).catch(e => e)
        })
}