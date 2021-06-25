import { Client, MessageReaction, PartialUser, User } from "discord.js";
import path from "path/posix";
import { loadJson } from "../utils/json.controller";
import logs from "../utils/logs";

export function requiredRull() {
    const data = loadJson(path.resolve("config", "default.json"))
    return {
        ruleId: data.channel_rule,
        rolesIds: data.role_rule,
    }
}

export function HandleRule(app: Client, react: MessageReaction, user: User | PartialUser) {
    try {
        react.users.remove(user.id)
        const member = react.message.guild?.member(user.id)
        const roles = requiredRull().rolesIds
        roles.map(e => {
            member?.roles.add(e).catch(e=> logs.warning("Actions Rule", "add role error"))
        })
    } catch {
        logs.error("Actions Rules")
    }
}