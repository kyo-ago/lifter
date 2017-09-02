declare module "@kyo-ago/electron-window-manager" {
    const exp: {
        init(...arg: any[]): void;
        open(...arg: any[]): any;
        get(name: string): any;
    };
    export = exp;
}
