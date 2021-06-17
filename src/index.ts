import Discord from "discord.js"
import path from "path/posix"

import config from "../config/default.json"
import { HandleTell, requiredTell } from "./actions/tell"
import tellConfigProps from "./interfaces/tellConfig.interface"
import HandleCommands from "./routes/commands.routes"
import { setJson } from "./utils/json.controller"

const app = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] })

app.on("messageReactionAdd", (react, user) => {
    if(user.bot) return

    if(requiredTell().id === react.message.id && requiredTell().memberId === user.id)
        HandleTell(app, react, user)
})

app.on("message", async (msg) => {
    if(msg.author.id === requiredTell().memberId && requiredTell().format) {
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

            const guild = app.guilds.cache.get('838839610300694579')
            const channel = guild?.channels.cache.find(e => e.id === msg.content)
            
            const notificate = new Discord.MessageEmbed()
	        .setColor('#a37443')
	        .setTitle(requiredTell().content.title)
	        .setDescription(requiredTell().content.context)
            .setThumbnail('https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            channel.send(notificate)
            return setJson(path.resolve("config", "tell.json"), {id:"", channelId:"", memberId: ""})
        }
    }
    if(msg.content.indexOf(config.prefix, 0) > 0 || msg.content.indexOf(config.prefix, 0) < 0 || msg.author.bot) return;
    
    //filter msg.content, split prefix
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args[0].toLowerCase()
    const msgContent = args.splice(0)
    
    //Checks if the command exists and filters it
    HandleCommands(command, app, msg, msgContent)
})

app.login(config.token)