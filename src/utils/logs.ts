const colors = {
    black: "\u001b[30m",
    red: "\u001b[31m",
    yellow: "\u001b[33m",
    green: "\u001b[32m",
    blue: "\u001b[34m",
    cyan: "\u001b[36m",
    reset: "\u001b[0m",
}
export default new class logs {
    error(locate: string, msg?: string) {
        console.log(colors.red+locate+":\n"+colors.yellow+msg+colors.reset)
    }
    log(locate: string, msg?: string) {
        console.log(colors.green+locate+":\n"+colors.green+msg+colors.reset)
    }
    warning(locate: string, msg?: string) {
        console.log(colors.yellow+locate+":\n"+colors.cyan+msg+colors.reset)
    }
}