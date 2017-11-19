declare module "sudo-prompt" {
    export function exec(...args: any[]): Promise<any>;
}

declare module "es6-promisify" {
    function promisify(...args: any[]): (...args: any[]) => Promise<any>;
    export = promisify;
}
