import { Client, Message, MessageEmbed } from "discord.js";
import path from "path";
import requiredProps from "../interfaces/required.interface";
import { loadJson, setJson } from "../utils/json.controller";
import logs from "../utils/logs";

export const required: requiredProps = {
    command: ["newchannel", "createchannel", "criarcanal"],
    commandShort: ["newch"],
    permission: "MANAGE_CHANNELS"
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    try {
        if(!args[1]) 
            return msg.channel.send(':yellow_circle: | Você esqueceu do nome do canal')
        const embed = new MessageEmbed()
            .setColor('#a37443')
            .setTitle('**Novo Canal**: '+args[1])
            .setThumbnail('https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
            .addFields(
                { value: ":scroll:", name: "Canal de Texto", inline: true },
                { value: ":loudspeaker:", name: "Canal de Notícias", inline: true },
                { value: ":bookmark_tabs:", name: "Categoria", inline: true },
                { value: ":microphone2:", name: "Canal de Voz", inline: true },
            )
            .setFooter("Team "+msg.guild?.name)
        const m = await msg.channel.send(embed)
        m.react("📜")
        m.react("📢")
        m.react("📑")
        m.react("🎙️")

        const oldData = loadJson(path.resolve("config", "newchannels.json"))
        const newData = [
            { id: m.id, memberId: msg.author.id, name: args[1], parent: args[2]? args[2] : undefined },
            ...oldData
        ]
        setJson(path.resolve("config", "newchannels.json"), newData)
    } catch {
        logs.error("Command NewChannel")
    }
}