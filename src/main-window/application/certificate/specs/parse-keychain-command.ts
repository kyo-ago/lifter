export function ParseKeychainCommand(commandResult: string): string {
    return commandResult.trim().split(/\r?\n/g).shift().replace(/^\s*"?|"?\s*$/g, '');
}
