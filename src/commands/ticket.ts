import { Client, Message } from "discord.js";
import path from "path";
import requiredProps from "../interfaces/required.interface";
import { setJson } from "../utils/json.controller";

export const required: requiredProps = {
    command: ["ticket"],
    commandShort: ["tc"],
    permission: ["ADMINISTRATOR"]
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    args.splice(0, 1)
    if(!args[0])
        return msg.channel.send(":yellow_circle: Você esqueceu do id da rule")
    if(!args[1])
        return msg.channel.send(":yellow_circle: Você esqueceu do id da Categoria")
    const m = await msg.channel.send("Reaja para criar o seu canal de voz")
    m.react("🎟️")
    setJson(path.resolve("config", "ticket.json"), { id: m.id, roleID: args[0], parent: args[1], channel: msg.channel.id, calls: [] })
}