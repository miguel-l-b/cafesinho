import { Client, Message } from "discord.js"
import fs from "fs"
import path from "path"
import requiredProps from "../interfaces/required.interface"

interface CommandsProps {
    required: requiredProps
    HandleCommand: (app: any, msg: any, args: any) => void
}

export default function HandleCommands(cmd: string, app: Client, msg: Message, args: string[]) {
    //Search for files from the commands folder
    fs.readdir(path.resolve("src", "commands"), async (err, files) => {
        const react = msg.react('✅')
        
        //scan and filter
        let undefinedCommand = 0
        const handlePaths = await files.map(e => {
                import(`../commands/${e}`).then(command => {
                    const { required, HandleCommand }: CommandsProps = command
                    if(required.command.indexOf(cmd) > -1 || required.commandShort.indexOf(cmd) > -1 ) {
                        if(required.permission && !msg.member?.hasPermission(required.permission))
                        return msg.channel.send(`:red_circle: Você não tem permissão para este commando\n ||é nescessário: ${required.permission}||`)
                        if(
                                                                    !required.dmChannel || 
                            required.dmChannel === false && msg.channel.type === 'news' ||
                            required.dmChannel === false && msg.channel.type === 'text' ||
                            required.dmChannel === true && msg.channel.type === 'dm'
                            ){
                            console.log(required.command[0])
                            return HandleCommand(app, msg, args)
                        }
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
                m.delete({ timeout: 5000 }).catch(e => console.log(`Guild Id: ${msg.guild?.id} \n Delete Message Error`, e.code))
            }
    })
}