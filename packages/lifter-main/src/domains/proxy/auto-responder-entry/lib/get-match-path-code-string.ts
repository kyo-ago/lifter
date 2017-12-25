export function GetMatchPathCodeString(proxyConnect: string, pattern_: string): string {
    let pattern = pattern_.replace(/\\/g, "\\").replace(/"/g, '\\"');
    return `
            if (~url.indexOf("${pattern}")) {
                return "${proxyConnect}";
            }
        `;
}
