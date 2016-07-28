export class AutoResponderEntryPattern {
    private regExp: RegExp;

    constructor(
        private value: string
    ) {
        this.regExp = new RegExp(`/${this.value}(/|$)`);
    }

    isMatch(path: string) {
        return this.regExp.test(path);
    }
}