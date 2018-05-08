const escapePattern = _ => _.replace(/\\/g, "\\").replace(/"/g, '\\"');

export function GetFileMatchCodeString(
    proxyConnect: string,
    text: string,
): string {
    let pattern = escapePattern(text);
    return `
            if (url.includes("${pattern}", url.length - "${pattern}".length)) {
                return "${proxyConnect}";
            }
        `;
}

export function GetDirectoryMatchCodeString(
    proxyConnect: string,
    text: string,
): string {
    let pattern = escapePattern(text);
    return `
            if (url.includes("${pattern}")) {
                return "${proxyConnect}";
            }
        `;
}
