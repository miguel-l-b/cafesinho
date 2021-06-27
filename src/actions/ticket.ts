import { MessageReaction, PartialUser, User, VoiceChannel } from "discord.js"
import path from "path"
import { loadJson, setJson } from "../utils/json.controller"

export function requiredTicket() {
    const data = loadJson(path.resolve("config", "ticket.json"))
    return{
        data: data
    }
}

export async function HandleTicket(react: MessageReaction, user: User | PartialUser) {
    const member = react.message.guild?.members.cache.get(user.id)
    const guild = react.message.guild
    let ticket = requiredTicket().data
    react.users.remove(user.id)
    if(!ticket.calls || ticket.calls.findIndex(e=> e.memberID === user.id) <= -1) {
        const newChannel: VoiceChannel = await guild?.channels.create(user.username, {
            type: "voice",
            parent: requiredTicket().data.parent,
            permissionOverwrites: [
                { id: "728707828193165352", deny: ["VIEW_CHANNEL", "CONNECT"] },
                { id: user.id, allow: ["VIEW_CHANNEL", "CONNECT"] },
            ]
        })
        ticket.calls = [ ...ticket.calls?ticket.calls:[], { memberID: user.id, channelID: await newChannel.id, perm: newChannel.permissionOverwrites } ]
        await newChannel && setJson(path.resolve("config", "ticket.json"), ticket)
    }
}