import {ParseKeychainCommand} from "./parse-keychain-command";

describe('ParseKeychainCommand', () => {
    it('succeed', () => {
        let result = ParseKeychainCommand(`
    "/Users/user/Library/Keychains/login.keychain-db"
    "/Library/Keychains/System.keychain"
`);
        expect(result).toBe("/Users/user/Library/Keychains/login.keychain-db");
    });
});
