declare module "es6-promisify" {
    function promisify(...args: any[]): (...args: any[]) => Promise<any>;
    namespace promisify {

    }
    export = promisify;
}
