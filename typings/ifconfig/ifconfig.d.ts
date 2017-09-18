interface Ifconfig {
    [name: string]: {
        flags: string;
        ether?: string;
        options?: string;
        media?: string;
        status?: "inactive" | "active";
        inet6?: string;
        inet?: string;
    }
}

declare module "ifconfig" {
    function ifconfig(callback: (err: any, configs: Ifconfig) => void): void;
    namespace ifconfig { }
    export = ifconfig;
}
