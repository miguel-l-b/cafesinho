import { Client, Message } from "discord.js"
import requiredProps from "../interfaces/required.interface"

export const required: requiredProps = {
    command: ["coffee", "cafe"],
    commandShort: ["co", "coff"],
}

export async function HandleCommand(_app: Client, msg: Message, _args: string[]) {
    const coffs = ["<:Coffee:855068647197245440>", "<:Cafe:853761463004037150>", " :coffee:"]
    let users = 0
    if(msg.mentions.members?.lastKey())
        return msg.mentions.members?.map(user => {
                users += 1
                if(users >= 4)
                return msg.channel.send(`${coffs[Math.floor(Math.random() * coffs.length)]} \n> É seu <@${user.id}>, quem pagou foi o \`@${msg.author.username}\``)
        })
    return msg.channel.send(coffs[Math.floor(Math.random() * coffs.length)])
}