import { Client, MessageEmbed, MessageReaction, PartialUser, TextChannel, User } from "discord.js";
import path from "path/posix";
import tellConfigProps from "../interfaces/tellConfig.interface";
import { loadJson, setJson } from "../utils/json.controller";
import logs from "../utils/logs";

export function requiredTell() {
    const data: tellConfigProps = loadJson(path.resolve("config", "tell.json"))
    return {
        id: data.id,
        channelId: data.channelId,
        memberId: data.memberId,
        format: data.format,
        img: data.img?data.img:"",
        content: data.content
    }
}

export async function HandleTell(app: Client, react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    try {
        const data: tellConfigProps = loadJson(path.resolve("config", "tell.json"))
        const channel = react.message.channel
        if(react.emoji.name === '📢') {
            const m = await channel.send(":bookmark_tabs: Infrome o título da Notificação | Anuncio").catch(e=> logs.warning("Actions Tell", react.emoji.name))
            const newData: tellConfigProps = {
                id: await m?.id,
                channelId: await m?.channel.id,
                format: `${react.emoji.name}-title`,
                memberId: data.memberId,
            }
            setJson(path.resolve("config", "tell.json"), newData)
        }  
        if(react.emoji.name === '📜') {
            const m = await channel.send(":bookmark_tabs: Informe as Regras").catch(e=> logs.warning("Actions Tell", react.emoji.name))
            const newData: tellConfigProps = {
                id: await m?.id,
                channelId: await m?.channel.id,
                format: `${react.emoji.name}-content`,
                memberId: data.memberId,
            }
            setJson(path.resolve("config", "tell.json"), newData)
        }
        if(react.emoji.name === '🖖') {
            const m = await channel.send(
                ":bookmark_tabs: Agora dê o titulo dos files e o contexto,"+
                "\n> Cada file em uma mensagem, ao terminar reaja com ✅"+
                "\n> Para eu saber onde está o titulo faça isso t|<aqui vc escreve o seu titulo>t|"+
                "\n> Use {user} para marcar o novo usuário"+
                "\n> Use {server} para o nome do servidor"+
                "\n> Use {rules} para marcar o canal de regras"
                ).catch(e=> logs.warning("Actions Tell", react.emoji.name))
            m?.react("✅")
            const newData: tellConfigProps = {
                id: await m?.id,
                channelId: await m?.channel.id,
                format: `${react.emoji.name}-content`,
                memberId: data.memberId,
            }
            setJson(path.resolve("config", "tell.json"), newData)
        }
        if(react.emoji.name === '🇹') {
            const m = await channel.send(":bookmark_tabs: Agora dê o contexto").catch(e=> logs.warning("Actions Tell", react.emoji.name))
            m?.react("✅")
            const newData: tellConfigProps = {
                id: await m?.id,
                channelId: await m?.channel.id,
                format: `${react.emoji.name}-content`,
                memberId: data.memberId,
            }
            setJson(path.resolve("config", "tell.json"), newData)
        }
        if(react.emoji.name === '✅') {
            const content = requiredTell().content
            const embed = new MessageEmbed()
            .setColor('#a37443')
            .setTitle("{user}│Bem Vindo!")
            .setThumbnail('https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png')
            .setImage(content.img)
            .addFields(content.content.map(e=> {
                return {
                    name: e.title,
                    value: e.content,
                }    
            }))
            .setFooter('Team {server}')
            const m = await channel.send(embed)
            setJson(path.resolve("config", "hello.json"), requiredTell().content)
            setJson(path.resolve("config", "tell.json"), {})
        }
    } catch {
        logs.error("Actions Tell")
    }
}