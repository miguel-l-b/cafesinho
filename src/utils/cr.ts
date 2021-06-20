import { Client, Message, MessageEmbed } from "discord.js";
import path from "path";
import RulesProps from "../interfaces/rules.interface";
import { loadJson, setJson } from "./json.controller";

export default async function HandleCommandCr(app: Client, msg: Message) {
    let requiredCr: RulesProps[] = loadJson(path.resolve("config", "rules.json"))
    const guild = msg.guild
    const indexCr = requiredCr.findIndex(e => e.channelID === msg.channel.id && e.userID === msg.author.id)

    if(indexCr > -1 && requiredCr[indexCr].messageID === "?") {
        msg.react("☑️")
        const channel = guild?.channels.cache.get(msg.content)
        let embed = new MessageEmbed()
        .setColor('#a37443')
        .setTitle(requiredCr[indexCr].title)
        .setDescription(requiredCr[indexCr].reacts.map(e=> {
            const em = guild?.emojis.cache.find(em=> em.name === e.emoji)
            if(e.emoji && em?.identifier !== undefined)
                return`**${guild?.roles.cache.get(e.rule)?.name}**ㅤ<a:Arrow:855151957760933898>ㅤ<:${em?.identifier}>\n`
            if(e.emoji && em?.identifier === undefined)
                return`**${guild?.roles.cache.get(e.rule)?.name}**ㅤ<a:Arrow:855151957760933898>ㅤ${e.emoji}\n`
        }))
        .setFooter('Team Coffe Cup', 'https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
        const m = await channel.send(embed)
        requiredCr[indexCr].reacts.map(e=> {
            const em = guild?.emojis.cache.find(em=> em.name === e.emoji)
            if(e.emoji && em?.identifier !== undefined)
            return m.react(`<:${em?.identifier}>`)
            if(e.emoji && em?.identifier === undefined)
            return m.react(e.emoji)
        })
        requiredCr[indexCr].messageID = m.id
        requiredCr[indexCr].userID = undefined
        setJson(path.resolve("config", "rules.json"), requiredCr)
    }
    if(indexCr > -1) {
        msg.react("☑️")
        requiredCr[indexCr].reacts = [
            ...requiredCr[indexCr].reacts,
            { rule: msg.content, messageID: msg.id, emoji: "" }
        ]
        setJson(path.resolve("config", "rules.json"), requiredCr)
    }
}