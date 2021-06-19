import { Client, Message } from "discord.js"
import requiredProps from "../interfaces/required.interface"

export const required: requiredProps = {
    command: ["ping"],
    commandShort: ["p"],
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    const message = await msg.channel.send(":ping_pong: Pong")
    msg.channel.send(
        `:satellite_orbital: | A Latência: ${message.createdTimestamp - msg.createdTimestamp}ms\n` +
        `:globe_with_meridians: | A Latência da API: ${Math.round(app.ws.ping)}ms`
        )
}