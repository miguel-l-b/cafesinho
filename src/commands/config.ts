import { Client, Message, MessageEmbed } from "discord.js";
import path from "path/posix";
import requiredProps from "../interfaces/required.interface";
import { loadJson } from "../utils/json.controller";

export const required: requiredProps = {
    command: ["config", "configurações"],
    commandShort: ["conf"],
    dmChannel: false,
    permission: "ADMINISTRATOR"
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {    
    const data = loadJson(path.resolve("config", "default.json"))
    const embed = new MessageEmbed()
    .setColor("#a37443")
    .setTitle(":gear: Configurações")
    .addFields(
        {name: ":placard: *prefix*: ", value: data.prefix, inline: true},
        {name: "\u200b", value: "\u200b", inline: false},
        {name: ":scroll: *regras ID*: ", value: data.rule, inline: true},
        {name: ":bookmark_tabs: *cargo ID, regras*: ", value: "null", inline: true}
        )
    const m = await msg.channel.send(embed)    
    m.react("🪧")
    m.react("📜")
    m.react("📑")
}