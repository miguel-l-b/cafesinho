import { Client, Message, MessageEmbed } from "discord.js"
import path from "path"
import requiredProps from "../interfaces/required.interface"
import RulesProps from "../interfaces/rules.interface"
import { loadJson, setJson } from "../utils/json.controller"

export const required: requiredProps = {
    command: ["cr"],
    commandShort: ["cr"],
    dmChannel: false,
    permission: "ADD_REACTIONS"
}

export async function HandleCommand(app: Client, msg: Message, args: string[]) {
    if(!args[1])
        return msg.channel.send(":yellow_circle: Você esqueceu o **Título**")
    args.splice(0, 1)
    const m = await msg.channel.send(":bookmark_tabs: Agora mande o ID do cargo e reaja,\n> separe os cargos por mensagens\n> 🔒 Para dar mais de um cargo\n> :white_check_mark: Ao terminar reaja com um\n> 🚫 Para cancelar")
    m.react("🔒")
    m.react("✅")
    m.react("🚫")
    const oldData: RulesProps[] = loadJson(path.resolve("config", "rules.json"))
    const newData: RulesProps[] = [
        ...oldData,
        { userID: msg.author.id, title: args.join(" "), messageID: m.id, channelID: msg.channel.id, reacts: [{rule: ""}] }
    ]

    setJson(path.resolve("config", "rules.json"), newData)
}