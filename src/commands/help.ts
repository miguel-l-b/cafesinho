import { Client, Message, MessageEmbed } from "discord.js"
import fs from "fs"
import path from "path"
import { HandleUpConfig } from ".."
import requiredProps from "../interfaces/required.interface"
import logs from "../utils/logs"

export const required: requiredProps = {
    command: ["help", "commands"],
    commandShort: ["h?", "?", "cmd"],
}

export function HandleCommand(app: Client, msg: Message, args: string[]) {
    try {
        const config = HandleUpConfig()
        fs.readdir(path.resolve("src", "commands"), async (err, files) => {
            let commands = 0
            let fields = [{ name: "Comando", value: ":red_circle: Restritos, :yellow_circle: Permitido para Você, :green_circle: Livres\nㅤ", inline: false}]
            const handled = await files.map(file => {
                import(`./${file}`).then(e => {
                    const requiredFile: requiredProps = e.required
                    !requiredFile.permission || msg.member?.hasPermission(requiredFile.permission)?
                    fields = [
                        ...fields,
                        {name: `${requiredFile.permission? ':yellow_circle:' : ':green_circle:'} | \`${config.prefix}${requiredFile.command[0]}\``, value: `${requiredFile.command.join(', ')}, ${requiredFile.commandShort.join(', ')}`, inline: false},
                    ]
                    : fields = [
                        ...fields,
                        {name: `:red_circle: | \`${config.prefix}${requiredFile.command[0]}\``, value: `||\`${requiredFile.command.join(', ')}, ${requiredFile.commandShort.join(', ')}\`||`, inline: false},
                    ]
                    return commands = (commands+1)
                })
            })
            if(await handled && commands === files.length) {
                fields = [
                    ...fields,
                    {name: "ㅤ", value: "ㅤ", inline: false}
                ]
                const embed = new MessageEmbed()
                .setColor("#a37443")
                .setTitle(":tools: Comandos")
                .setFooter("Team "+msg.guild?.name, "https://cdn.discordapp.com/attachments/845795759127527474/854893821150101544/Logo3PNG.png")
                .addFields(fields)
                msg.channel.send(embed)
            }
        })
    } catch {
        logs.error("Command Help")
    }
}