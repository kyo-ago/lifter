declare module "electron-ipc" {
    const ipc: {
        on(key: string, callback: (message: any) => (Promise<any> | void)): void;
        publish: (key: string, message?: any) => Promise<any>;
    };
    export = ipc;
}
