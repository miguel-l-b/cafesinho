import Discord, { MessageEmbed } from "discord.js"
import path from "path"
import { HandleConfig, requireConfig } from "./actions/config"

import { HandleCr, HandleCrAdd, HandleCrRemove, HandleMsgRemove, requiredCr } from "./actions/cr"
import { HandleNewChannel, requiredNewChannel } from "./actions/newChannel"
import { HandleRule, requiredRull } from "./actions/rule"
import { HandleTell, requiredTell } from "./actions/tell"
import { HandleTicket, requiredTicket } from "./actions/ticket"
import HandleCommands from "./routes/commands.routes"
import HandleCommandCr from "./utils/cr"
import { loadJson, setJson } from "./utils/json.controller"
import logs from "./utils/logs"
import HandleTellMsg from "./utils/tell"

const app = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] })

let config = loadJson(path.resolve("config", "default.json"))

export function HandleUpConfig() {
    config = loadJson(path.resolve("config", "default.json"))
    return config
}

app.on("ready", () => logs.log("Started", app.user?.tag))

app.on("channelDelete", (channel) => {
    const indexChannel = requiredTicket().data.calls.findIndex(e=> e.channelID === channel.id)
    let ticket = requiredTicket().data
    if(indexChannel > -1) {
        ticket.calls.splice(indexChannel, 1)
        setJson(path.resolve("config", "ticket.json"), ticket)
    }
})

app.on("guildMemberAdd", (member) => {
    const guild = app.guilds.cache.get(member.guild.id)
    const newHello = loadJson(path.resolve("config", "hello.json"))
    const config = loadJson(path.resolve("config", "default.json"))
    const embed = new MessageEmbed()
        .setColor('#a37443')
        .setTitle("{user}│Bem Vindo!")
        .setThumbnail('https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
        .setImage(newHello.img)
        .addFields(newHello.content.map(e=> {
            return {
                name: e.title.replace("{user}", `<@${member.id}>`).replace("{server}", `<@${guild?.name}>`).replace("{rules}", `<#${config.channel_rule}>`),
                value: e.content.replace("{user}", `<@${member.id}>`).replace("{server}", `**${guild?.name}**`).replace("{rules}", `<#${config.channel_rule}>`),
            }    
        }))
        .setFooter('Team '+member.guild.name)
    const channel = guild?.channels.cache.get("854871218373263360")
    channel?.send(embed).catch(e=> logs.warning("Well Come", "Send Message"))
})

app.on("messageReactionRemove", (react, user) => {
    if(user.bot) return
    if(requiredCr().data.findIndex(e=> !e.userID && e.rmReact && e.messageID === react.message.id) > -1)
        return HandleCrRemove(app, react, user)
})

app.on("messageReactionAdd", (react, user) => {
    try {
    if(user.bot) return
    if(requiredTicket().data?.id === react.message.id)
        HandleTicket(react, user)
    if(requiredTell().id === react.message.id && requiredTell().memberId === user.id)
        HandleTell(app, react, user)
    if(requireConfig().data.type === "config" && requireConfig().data.id === react.message.id && requireConfig().data.member === user.id)
        HandleConfig(react, user)
    if(requiredNewChannel(react.message.id, user.id))
        HandleNewChannel(app, react, user)
    if(requiredRull().ruleId === react.message.id)
        HandleRule(app, react, user)
    if(requiredCr().data.findIndex(e=> !e.userID && e.messageID === react.message.id) > -1)
        return HandleCrAdd(app, react, user)
    if(
        requiredCr().data.findIndex(e=> e.messageID === react.message.id && e.userID === user.id) > -1 || 
        requiredCr().data.findIndex(e=> { if(e.reacts.findIndex(e=> e.messageID === react.message.id)> -1 && e.userID === user.id) return true}) > -1
    )
        HandleCr(app, react, user)
    } catch(e) {
        logs.error("Message React", e)
    }
})

app.on("messageDelete", (msg) => {
    if(requiredCr().data.findIndex(e=> e.messageID === msg.id) > -1)
        HandleMsgRemove(msg)
    if(requiredTicket().data.id === msg.id)
        setJson(path.resolve("config", "ticket.json"), {})
})

app.on("message", async (msg) => {    
    if(msg.author.id === requiredTell().memberId && requiredTell().format) {
        HandleTellMsg(app, msg)
    }
    HandleCommandCr(app, msg)
    if(msg.content.indexOf(config.prefix, 0) > 0 || msg.content.indexOf(config.prefix, 0) < 0 || msg.author.bot) return;
    
    //filter msg.content, split prefix
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const msgContent = args.splice(0)
    
    //Checks if the command exists and filters it
    HandleCommands(command, app, msg, msgContent)
})

app.login(config.token)