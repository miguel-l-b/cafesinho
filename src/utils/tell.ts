import { Client, Message, MessageEmbed } from "discord.js"
import { requiredTell } from "../actions/tell"
import tellConfigProps from "../interfaces/tellConfig.interface"
import { loadJson, setJson } from "./json.controller"
import path from "path"
import { HandleUpConfig } from ".."

export default async function HandleTellMsg(app: Client, msg: Message) {
    if(requiredTell().format === '📢-title'){
        msg.react('✅')
        const m = await msg.channel.send(":bookmark_tabs: Agora dê o contexto")
        const newData: tellConfigProps = {
            id: m.id,
            channelId: requiredTell().channelId,
            format: '📢-context',
            memberId: requiredTell().memberId,
            content: {title: msg.content}
        }
        return setJson(path.resolve("config", "tell.json"), newData)
    }
    if(requiredTell().format === '📢-context'){
        msg.react('✅')
        const m = await msg.channel.send(":receipt: pronto embed criado com sucesso, marque o canal")
        const newData: tellConfigProps = {
            id: m.id,
            channelId: requiredTell().channelId,
            format: '📢-channel',
            memberId: requiredTell().memberId,
            content: {title: requiredTell().content.title, context: msg.content}
        }
        return setJson(path.resolve("config", "tell.json"), newData)
    }
    if(requiredTell().format === '📢-channel' && msg.mentions.channels){
        msg.react('✅')

        const channel = msg.guild?.channels.cache.find(e => e.id === msg.content)
        
        const notificate = new MessageEmbed()
        .setColor('#a37443')
        .setTitle(requiredTell().content.title)
        .setDescription(requiredTell().content.context)
        .setThumbnail('https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
        .setFooter(msg.author.username, msg.author.displayAvatarURL())
        channel.send(notificate)
        return setJson(path.resolve("config", "tell.json"), {id:"", channelId:"", memberId: ""})
    }
    if(requiredTell().format === '📜-content'){
        msg.react('✅')
        const m = await msg.channel.send(":receipt: Agora informe o canal de regras")
        const newData: tellConfigProps = {
            id: m.id,
            channelId: requiredTell().channelId,
            format: '📜-channel',
            memberId: requiredTell().memberId,
            content: {title: "**Regras do servidor Coffee Cup**", content: msg.content}
        }
        return setJson(path.resolve("config", "tell.json"), newData)
    }
    if(requiredTell().format === '📜-channel'){
        msg.react('✅')

        const channel = msg.guild?.channels.cache.find(e => e.id === msg.content)

        const rules = new MessageEmbed()
        .setTitle(requiredTell().content.title)
        .setColor('#a37443')
        .setDescription(requiredTell().content.content)
        .setThumbnail("https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png")
        .setFooter("Team Coffee Cup")
        const m = await channel.send(rules)
        m.react("✅")
        const oldDefault = loadJson(path.resolve("config", "default.json"))
        const newDefault = {
            token: oldDefault.token,
            prefix: oldDefault.prefix,
            rule: m.id,
        } 
        setJson(path.resolve("config", "default.json"), newDefault)
        HandleUpConfig()
        return setJson(path.resolve("config", "tell.json"), {
            id: "",
            channelId: "",
            memberId: "",
        })
    }
}