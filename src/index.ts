import Discord from "discord.js"
import path from "path"

import { HandleCrAdd, requiredCr } from "./actions/cr"
import { HandleNewChannel, requiredNewChannel } from "./actions/newChannel"
import { HandleRule, requiredRull } from "./actions/rule"
import { HandleTell, requiredTell } from "./actions/tell"
import HandleCommands from "./routes/commands.routes"
import { loadJson } from "./utils/json.controller"
import HandleTellMsg from "./utils/tell"

const app = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] })

let config = loadJson(path.resolve("config", "default.json"))

export function HandleUpConfig() {
    config = loadJson(path.resolve("config", "default.json"))
    return config
}

app.on("messageReactionAdd", (react, user) => {
    if(user.bot) return

    if(requiredTell().id === react.message.id && requiredTell().memberId === user.id)
        HandleTell(app, react, user)
    if(requiredNewChannel(react.message.id, user.id))
        HandleNewChannel(app, react, user)
    if(requiredRull().ruleId === react.message.id)
        HandleRule(app, react, user)
    if(requiredCr().msgID.findIndex(e => react.message.id) > -1)
        HandleCrAdd(app, react, user)
})

app.on("message", async (msg) => {
    const guild = msg.guild
    guild?.members.cache.map(member => {
            const roles = [
                "731109166676049950", "855595932313976842",
                "855592465914527796", "855592101172871209",
                "855595492193206282", "855596132695408642",
                "855591343387574272", "855599352965234688"
            ]
            roles.map(e => {
                console.log("cargo novo", member.user.username)
                member?.roles.add(e).catch(e=> console.log("Error rull add"))
            })
    })
    
    if(msg.author.id === requiredTell().memberId && requiredTell().format) {
        HandleTellMsg(app, msg)
    }
    if(msg.content.indexOf(config.prefix, 0) > 0 || msg.content.indexOf(config.prefix, 0) < 0 || msg.author.bot) return;
    
    //filter msg.content, split prefix
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const msgContent = args.splice(0)
    
    //Checks if the command exists and filters it
    HandleCommands(command, app, msg, msgContent)
})

app.login(config.token)