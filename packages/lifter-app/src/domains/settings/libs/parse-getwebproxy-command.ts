import { NETWORK_HOST_NAME, PROXY_PORT } from "../../../settings";

// export for tests
export interface CommandResult {
    Enabled: "Yes" | "No";
    Server: string;
    Port: string;
    "Authenticated Proxy Enabled": string;
}

export function ParseGetwebproxyCommand(stdout: string): boolean {
    let result = stdout
        .trim()
        .split(/\r?\n/)
        .reduce(
            (base: Partial<CommandResult>, cur: string) => {
                let [key, val] = cur.split(/:/);
                (<any>base)[key.trim()] = val.trim();
                return base;
            },
            <Partial<CommandResult>>{}
        );

    if (result.Enabled !== "Yes") {
        return false;
    }
    if (result.Server !== NETWORK_HOST_NAME) {
        return false;
    }
    if (result.Port !== String(PROXY_PORT)) {
        return false;
    }
    return true;
}
