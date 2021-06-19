import { Client, MessageReaction, PartialUser, User } from "discord.js";
import path from "path";
import { loadJson } from "../utils/json.controller";

export function requiredCr() { 
    const data = loadJson(path.resolve("config", "cr.json"))
    return {
        msgID: data
    }
}

async function clearCor(react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    const member = react.message.guild?.member(user.id)
        await member?.roles.remove(
            [
                "854361023287656488", "854361090272395274", 
                "854361608050049104", "854361731900112926", 
                "854361162278633483", "854361265769414676",
                "854361338247774218", "854361217312751636"
            ]
        )
        .catch(e => console.log("error Cor reação"))
}

async function clearSex(react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    const member = react.message.guild?.member(user.id)
        await member?.roles.remove(
            [
                "855610450922045470", "855610671138734080", 
                "855610502624575548",
            ]
        )
        .catch(e => console.log("error Cor reação"))
}

async function clearReg(react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    const member = react.message.guild?.member(user.id)
        await member?.roles.remove(
            [
                "855612012306366475", "855612286109614080", 
                "855612499637174332", "855612717615153152",
                "855612857281413160", "855612969153069076",
            ]
        )
        .catch(e => console.log("error Cor reação"))
}

export async function HandleCrAdd(app: Client, react: MessageReaction, user: User | PartialUser) {
    const member = react.message.guild?.member(user.id)
    //color
    if(react.emoji.name === "🟢"){
        await clearCor(react, user)
        return member?.roles.add("854361023287656488")
    }
    if(react.emoji.name === "🟣") {
        await clearCor(react, user)
        return member?.roles.add("854361090272395274")
    }
    if(react.emoji.name === "💗") {
        await clearCor(react, user)
        return member?.roles.add("854361608050049104")
    }
    if(react.emoji.name === "🌀"){
        await clearCor(react, user)
        return member?.roles.add("854361731900112926")
    }
    if(react.emoji.name === "🔵"){
        await clearCor(react, user)
        return member?.roles.add("854361162278633483")
    }
    if(react.emoji.name === "🟡"){
        await clearCor(react, user)
        return member?.roles.add("854361265769414676")
    }
    if(react.emoji.name === "🟤"){
        await clearCor(react, user)
        return member?.roles.add("854361338247774218")
    }
    if(react.emoji.name === "🔴"){
        await clearCor(react, user)
        return member?.roles.add("854361217312751636")
    }
    //sex
    if(react.emoji.name === "🙍‍♀️"){
        await clearSex(react, user)
        return member?.roles.add("855610450922045470")
    }
    if(react.emoji.name === "🙍‍♂️"){
        await clearSex(react, user)
        return member?.roles.add("855610671138734080")
    }
    if(react.emoji.name === "🙍"){
        await clearSex(react, user)
        return member?.roles.add("855610502624575548")
    }
    //regions
    if(react.emoji.name === "⚖️"){
        await clearReg(react, user)
        return member?.roles.add("855612012306366475")
    }
    if(react.emoji.name === "🌵"){
        await clearReg(react, user)
        return member?.roles.add("855612286109614080")
    }
    if(react.emoji.name === "🌃"){
        await clearReg(react, user)
        return member?.roles.add("855612499637174332")
    }
    if(react.emoji.name === "🛖"){
        await clearReg(react, user)
        return member?.roles.add("855612717615153152")
    }
    if(react.emoji.name === "🥖"){
        await clearReg(react, user)
        return member?.roles.add("855612857281413160")
    }
    if(react.emoji.name === "🌎"){
        await clearReg(react, user)
        return member?.roles.add("855612969153069076")
    }
    //music
    if(react.emoji.name === "<:Coffee:855068647197245440>"){
        return member?.roles.add("855615210936991745")
    }
    if(react.emoji.name === "🎛"){
        return member?.roles.add("855615755894915084")
    }
    if(react.emoji.name === "👯"){
        return member?.roles.add("855615999927255050")
    }
    if(react.emoji.name === "🎸"){
        return member?.roles.add("855616096061095937")
    }
    if(react.emoji.name === "💸"){
        return member?.roles.add("855616247332601887")
    }
    if(react.emoji.name === "🍻"){
        return member?.roles.add("855616433991188570")
    }
    if(react.emoji.name === "⛓"){
        return member?.roles.add("855616542426267679")
    }
    if(react.emoji.name === "🥁"){
        return member?.roles.add("855616695628464139")
    }
    if(react.emoji.name === "🎻"){
        return member?.roles.add("855616810695262218")
    }
    if(react.emoji.name === "🎷"){
        return member?.roles.add("855616976566878238")
    }
    if(react.emoji.name === "<:IRADO:853379939550101514>"){
        return member?.roles.add("855617120850280459")
    }
}