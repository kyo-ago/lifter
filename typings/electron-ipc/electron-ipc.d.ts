declare module "electron-ipc" {
    const ipc: {
        subscribe(key: string, callback: (event: any, message: any) => (Promise<any> | void)): void;
        publish: (key: string, message?: any) => Promise<any>;
        addWindow(window: any): void;
        removeWindow(window: any): void;
    };
    export = ipc;
}
