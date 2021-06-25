import { Client, Message, MessageReaction, PartialMessage, PartialUser, User } from "discord.js";
import path from "path";
import RulesProps from "../interfaces/rules.interface";
import { loadJson, setJson } from "../utils/json.controller";
import logs from "../utils/logs";

export function requiredCr() { 
    const data: RulesProps[] = loadJson(path.resolve("config", "rules.json"))
    return {
        data: data
    }
}
export async function HandleMsgRemove(msg: Message | PartialMessage) {
    try {
        const newData = requiredCr().data
        const indexCr = requiredCr().data.findIndex(e=> e.messageID === msg.id)
        newData.splice(indexCr, 1)

        setJson(path.resolve("config", "rules.json"), newData)
    } catch {
        logs.error("Actions Cr Msg Remove")
    }
}
export async function HandleCrRemove(app: Client, react: MessageReaction, user: User | PartialUser) {
    try {
    const member = react.message.guild?.member(user.id)
    const indexCr = requiredCr().data.findIndex(e=> e.messageID === react.message.id)
    const indexReact = requiredCr().data[indexCr].reacts.findIndex(e=> e.emoji === react.emoji.name)
    const ruleID = requiredCr().data[indexCr].reacts[indexReact].rule
    member?.roles.remove(ruleID).catch(e => logs.warning("Action Cr", react.emoji.name))
    } catch {
        logs.error("Actions Cr Remove")
    }
}
export async function HandleCr(app: Client, react: MessageReaction, user: User | PartialUser) {
    try {
        const member = react.message.guild?.member(user.id)
        let newData = requiredCr().data
        if(requiredCr().data.findIndex(e=> e.messageID === react.message.id) > -1) {
            react.users.remove(user.id)
            const indexCr = requiredCr().data.findIndex(e=> e.messageID === react.message.id)
            const channel = react.message.channel

            if(react.emoji.name === "✅") {
                newData[indexCr].messageID = "?"
                channel.send(":receipt: Agora mande o ID canal")
                return setJson(path.resolve("config", "rules.json"), newData)
            }
            if(react.emoji.name == "🚫") {
                newData.splice(indexCr, 1)
                channel.send("✅ Pronto, mensagem de cargo cancelada")
                return setJson(path.resolve("config", "rules.json"), newData)
            }
            if(react.emoji.name === "🔒") {
                newData[indexCr].rmReact = true
                return setJson(path.resolve("config", "rules.json"), newData)
            }
        }
        if(requiredCr().data.findIndex(e=> { if(e.userID === user.id && e.reacts.findIndex(e=> e.messageID === react.message.id)> -1) return true}) > -1){
            const indexCr = requiredCr().data.findIndex(e=> e.reacts.findIndex(e=> e.messageID === react.message.id) > -1)
            const indexReact = requiredCr().data[indexCr].reacts.findIndex(e=> e.messageID === react.message.id)

            newData[indexCr].reacts[indexReact].emoji = react.emoji.name
            return setJson(path.resolve("config", "rules.json"), newData)
        }
    } catch {
        logs.error("Actions Cr")
    }
}

async function clear(indexCr: number, rule: string, member: any) {
    try {
        await requiredCr().data[indexCr].reacts.map(e => {
            if(member?.roles.cache.has(e.rule) && e.rule !== rule)
            member?.roles.remove(e.rule).catch(e => logs.warning("Action Cr", react.emoji.name))
        }) 
    } catch {
        logs.error("Actions Cr")
    }
}

export async function HandleCrAdd(app: Client, react: MessageReaction, user: User | PartialUser) {
    try {
        const member = react.message.guild?.member(user.id)
        const indexCr = requiredCr().data.findIndex(e=> e.messageID === react.message.id)
        const indexReact = requiredCr().data[indexCr].reacts.findIndex(e=> e.emoji === react.emoji.name)
        const ruleID = requiredCr().data[indexCr].reacts[indexReact].rule
        member?.roles.add(ruleID).catch(e => logs.warning("Action Cr", react.emoji.name))
        if(!requiredCr().data[indexCr].rmReact || indexCr <= -1){
            await clear(indexCr, ruleID, member)
            return react.users.remove(user.id)
        }
    } catch {
        logs.error("Actions Cr")
    }
}