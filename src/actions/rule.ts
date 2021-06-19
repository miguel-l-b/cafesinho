import { Client, MessageReaction, PartialUser, User } from "discord.js";
import path from "path/posix";
import { loadJson } from "../utils/json.controller";

export function requiredRull() {
    const data = loadJson(path.resolve("config", "default.json"))
    return {
        ruleId: data.rule
    }
}

export function HandleRule(app: Client, react: MessageReaction, user: User | PartialUser) {
    react.users.remove(user.id)
    const member = react.message.guild?.member(user.id)
    const roles = [
        "731109166676049950", "855595932313976842",
        "855592465914527796", "855592101172871209",
        "855595492193206282", "855596132695408642",
        "855591343387574272", "855599352965234688"
    ]
    roles.map(e => {
        member?.roles.add(e).catch(e=> console.log("Error rull add"))
    })
}