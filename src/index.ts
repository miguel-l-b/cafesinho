import Discord from "discord.js"
import path from "path"

import { HandleCr, HandleCrAdd, HandleCrRemove, HandleMsgRemove, requiredCr } from "./actions/cr"
import { HandleNewChannel, requiredNewChannel } from "./actions/newChannel"
import { HandleRule, requiredRull } from "./actions/rule"
import { HandleTell, requiredTell } from "./actions/tell"
import HandleCommands from "./routes/commands.routes"
import HandleCommandCr from "./utils/cr"
import { loadJson } from "./utils/json.controller"
import HandleTellMsg from "./utils/tell"

const app = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] })

let config = loadJson(path.resolve("config", "default.json"))

export function HandleUpConfig() {
    config = loadJson(path.resolve("config", "default.json"))
    return config
}

app.on("messageReactionRemove", (react, user) => {
    if(user.bot) return
    if(requiredCr().data.findIndex(e=> !e.userID && e.rmReact && e.messageID === react.message.id) > -1)
        return HandleCrRemove(app, react, user)
})

app.on("messageReactionAdd", (react, user) => {
    if(user.bot) return

    if(requiredTell().id === react.message.id && requiredTell().memberId === user.id)
        HandleTell(app, react, user)
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
})

app.on("messageDelete", (msg) => {
    if(requiredCr().data.findIndex(e=> e.messageID === msg.id) > -1)
        HandleMsgRemove(msg)
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