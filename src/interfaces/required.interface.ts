import { PermissionResolvable } from "discord.js";

export default interface requiredProps {
    command: string[],
    commandShort: string[],
    dmChannel?: boolean,
    permission?: PermissionResolvable,
}