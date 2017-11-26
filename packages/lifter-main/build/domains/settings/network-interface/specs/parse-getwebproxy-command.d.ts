export interface CommandResult {
    Enabled: "Yes" | "No";
    Server: string;
    Port: string;
    "Authenticated Proxy Enabled": string;
}
export declare function ParseGetwebproxyCommand(stdout: string): boolean;
