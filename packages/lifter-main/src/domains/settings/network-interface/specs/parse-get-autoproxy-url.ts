import { LOCAL_PAC_FILE_URL } from "../../../../settings";

export interface CommandResult {
    URL: string;
    Enabled: "Yes" | "No";
}

export function ParseGetAutoproxyUrl(stdout: string): boolean {
    let result = stdout
        .trim()
        .split(/\r?\n/)
        .reduce(
            (base: Partial<CommandResult>, cur: string) => {
                let [key, ...val] = cur.split(/:/);
                (<any>base)[key.trim()] = val.join(':').trim();
                return base;
            },
            <Partial<CommandResult>>{},
        );
    if (result.Enabled !== "Yes") {
        return false;
    }
    if (!LOCAL_PAC_FILE_URL.test(result.URL)) {
        return false;
    }
    return true;
}
