import { Client, Message, MessageEmbed } from "discord.js";
import path from "path";
import requiredProps from "../interfaces/required.interface";
import { loadJson, setJson } from "../utils/json.controller";
import logs from "../utils/logs";

export const required: requiredProps = {
    command: ["config", "configurações"],
    commandShort: ["conf"],
    dmChannel: false,
    permission: "ADMINISTRATOR"
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {    
    try {
        const data = loadJson(path.resolve("config", "default.json"))
        const embed = new MessageEmbed()
        .setColor("#a37443")
        .setTitle(":gear: Configurações")
        .addFields(
            {name: ":placard: prefix: ", value: data.prefix, inline: false},
            {name: ":scroll: ID mensagem __regras__: ", value: `${data.channel_rule}`, inline: true},
            {name: ":bookmark_tabs: ID do cargo de __regras__: ", value: `${data.role_rule.map(e=> "@"+msg.guild?.roles.cache.get(e)?.name)}`, inline: true}
            )
        const m = await msg.channel.send(embed)    
        m.react("🪧")
        m.react("📜")
        m.react("📑")
        const newData = { type: "config", id: m.id, member: msg.author.id, channelID: msg.channel.id }
        setJson(path.resolve("config", "conf.json"), newData)
    } catch(e) {
        logs.error("Command Config", e)
    }
}