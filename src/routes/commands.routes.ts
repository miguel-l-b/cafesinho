import { Client, Message } from "discord.js"
import fs from "fs"
import path from "path"

export default function HandleCommands(cmd: string, app: Client, msg: Message, args: string[]) {
    //Search for files from the commands folder
    fs.readdir(path.resolve("src", "commands"), async (err, files) => {
        const react = msg.react('✅')
        if(msg.channel.type === "news" || msg.channel.type === "text")
            msg.delete({ timeout: 8000 }).catch(e => console.log(`Guild Id: ${msg.guild?.id} \n Delete Message Error`, e.code))

        //scan and filter
        let undefinedCommand = 0
        const handlePaths = await files.map(e => {
                import(`../commands/${e}`).then(command => {
                    const { required, HandleCommand } = command
                    if(required.command === cmd || required.commandShort === cmd) {
                        if(
                                                                    !required.dmChannel || 
                            required.dmChannel === false && msg.channel.type === 'news' ||
                            required.dmChannel === false && msg.channel.type === 'text' ||
                            required.dmChannel === true && msg.channel.type === 'dm'
                            )
                            return HandleCommand(app, msg, args)
                        else
                            return undefinedCommand = (undefinedCommand+1)
                    } else
                        return undefinedCommand = (undefinedCommand+1)
                })
        })

            if(await handlePaths && undefinedCommand === files.length) {
                (await react).remove()
                await msg.react('🚫')
                const m = await msg.channel.send(":sob: | Infelizmente esse comando não existe")
                m.delete({ timeout: 5000 })
            }
    })
}