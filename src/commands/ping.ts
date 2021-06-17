import { Client, Message } from "discord.js"

export const required = {
    command: "ping",
    commandShort: "p",
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    const message = await msg.channel.send(":ping_pong: | Ping ou Pong?")
    message.edit(
        ':ping_pong: É ping!\n'+
        `:satellite_orbital: | A Latência: ${message.createdTimestamp - msg.createdTimestamp}ms\n` +
        `:globe_with_meridians: | A Latência da API: ${Math.round(app.ws.ping)}ms`
        )
}