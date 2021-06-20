
interface React { 
    emoji?: string, 
    rule: string,
    messageID?: string,
}

export default interface RulesProps {
    messageID?: string,
    channelID?: string,
    userID?: string,
    title: string,
    rmReact?: Boolean,
    reacts: React[],
}