import { Client, Message, MessageEmbed } from "discord.js";
import requiredProps from "../interfaces/required.interface";
import logs from "../utils/logs";

export const required: requiredProps = {
    command: ["vote", "top.gg"],
    commandShort: ["vt", "top"]
}

export function HandleCommand(_app: Client, msg: Message, _args: string[]) {
   try {
        const embed = new MessageEmbed()
        .setTitle('Vota, você vai me ajudar muito')
        .addField("top.gg", "https://top.gg/servers/728707828193165352/vote", true)
        .setFooter('Team '+msg.guild?.name, 'https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
        msg.channel.send(embed)
   } catch {
        logs.error("Command Vote")
   }
}