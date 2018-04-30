import { getIfconfig } from "../../libs/exec-commands";

export async function fetchIfconfig(): Promise<Ifconfig> {
    let ifconfig = await getIfconfig();
    return ifconfig
        .trim()
        .split(/(?=^\w)/m)
        .reduce((base, cur) => {
            let [key, ...body] = cur.split(/(\s*:\s*)/);
            body.shift();
            base[key] = body
                .join("")
                .split(/\r?\n/)
                .filter(_ => _)
                .reduce((base, cur) => {
                    let [key, ...body] = cur.trim().split(/(\W)/);
                    body.shift();
                    base[key] = body.join("").trim();
                    return base;
                }, {});
            return base;
        }, {});
}
