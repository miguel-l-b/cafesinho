import { Client, Message, MessageEmbed } from "discord.js"
import path from "path"
import requiredProps from "../interfaces/required.interface"
import { loadJson, setJson } from "../utils/json.controller"

export const required: requiredProps = {
    command: ["cr"],
    commandShort: ["cr"],
    dmChannel: false,
    permission: "ADD_REACTIONS"
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    msg.delete({ timeout: 10 })
    const oldData = loadJson(path.resolve("config", "cr.json"))
    let newData = [...oldData]
    if(args[1] === "cor") {
        const embed = new MessageEmbed()
        .setColor("#a37443")
        .setTitle("**Quer que seu nome assuma uma cor personalizada?\napenas reaja a essa mensagem com a cor que deseja.**")
        .setFooter("Team Coffee Cup", "https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png")
        const m = await msg.channel.send(embed)
        m.react("🟢")
        m.react("🟣")
        m.react("💗")
        m.react("🌀")
        m.react("🔵")
        m.react("🟡")
        m.react("🟤")
        m.react("🔴")
        newData = [m.id, ...oldData]
    }
    if(args[1] === "sex") {
        const embed = new MessageEmbed()
        .setColor("#a37443")
        .setTitle("**Gênero**")
        .addField("Mulher", ":woman_frowning:", true)
        .addField("Homem", ":man_frowning:", true)
        .addField("Outros", ":person_frowning:", true)
        .setFooter("Team Coffee Cup", "https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png")
        const m = await msg.channel.send(embed)
        m.react("🙍‍♀️")
        m.react("🙍‍♂️")
        m.react("🙍")
        newData = [m.id, ...oldData]
    }
    if(args[1] === "reg") {
        const embed = new MessageEmbed()
        .setColor("#a37443")
        .setTitle("**Região**")
        .addField("Centro-Oeste", ":scales:", true)
        .addField("Nordeste", ":cactus:", true)
        .addField("Sudeste", ":night_with_stars:", true)
        .addField("Norte", ":hut:", true)
        .addField("Sul", ":french_bread:", true)
        .addField("Gringo", ":earth_americas:", true)
        .setFooter("Team Coffee Cup", "https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png")
        const m = await msg.channel.send(embed)
        m.react("⚖️")
        m.react("🌵")
        m.react("🌃")
        m.react("🛖")
        m.react("🥖")
        m.react("🌎")
        newData = [m.id, ...oldData]
    }
    if(args[1] === "music") {
        const embed = new MessageEmbed()
        .setColor("#a37443")
        .setTitle("**Estilo Musical**")
        .setDescription(
            "Lo-fiㅤ<a:Arrow:855151957760933898>ㅤ<:Coffee:855068647197245440>\n"+
            "Eletrônicaㅤ<a:Arrow:855151957760933898>ㅤ🎛\n"+
            "Popㅤ<a:Arrow:855151957760933898>ㅤ👯\n"+
            "Rockㅤ<a:Arrow:855151957760933898>ㅤ🎸\n"+
            "Trapㅤ<a:Arrow:855151957760933898>ㅤ💸\n"+
            "Sertanejoㅤ<a:Arrow:855151957760933898>ㅤ🍻\n"+
            "Hip Hopㅤ<a:Arrow:855151957760933898>ㅤ⛓\n"+
            "Pagode / Sambaㅤ<a:Arrow:855151957760933898>ㅤ🥁\n"+
            "Clássicaㅤ<a:Arrow:855151957760933898>ㅤ🎻\n"+
            "Jazzㅤ<a:Arrow:855151957760933898>ㅤ🎷\n"+
            "Funkㅤ<a:Arrow:855151957760933898>ㅤ<:IRADO:853379939550101514>\n"
        )
        .setFooter("Team Coffee Cup", "https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png")
        const m = await msg.channel.send(embed)
        m.react("<:Coffee:855068647197245440>")
        m.react("🎛")
        m.react("👯")
        m.react("🎸")
        m.react("💸")
        m.react("🍻")
        m.react("⛓")
        m.react("🥁")
        m.react("🎻")
        m.react("🎷")
        m.react("<:IRADO:853379939550101514>")
        newData = [m.id, ...oldData]
    }
    setJson(path.resolve("config", "cr.json"), newData)
}