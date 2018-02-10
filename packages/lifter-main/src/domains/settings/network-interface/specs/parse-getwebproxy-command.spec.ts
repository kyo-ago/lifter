import "mocha";
import * as assert from "assert";
import { NETWORK_HOST_NAME, PROXY_PORT } from "../../../../settings";
import { CommandResult, ParseGetwebproxyCommand } from "./parse-getwebproxy-command";

describe("ParseGetwebproxyCommand", () => {
    let testCommand = (command: CommandResult) => {
        return ParseGetwebproxyCommand(`Enabled: ${command.Enabled}
Server: ${command.Server}
Port: ${command.Port}
Authenticated Proxy Enabled: 0
`);
    };

    [
        {
            param: {},
            result: true,
        },
        {
            param: { Enabled: "No" },
            result: false,
        },
        {
            param: { Server: "example.com" },
            result: false,
        },
        {
            param: { Port: 0 },
            result: false,
        },
    ].forEach((command: { param: Partial<CommandResult>; result: boolean }) => {
        it(JSON.stringify(command.param), () => {
            let param = Object.assign(
                {
                    Enabled: "Yes",
                    Server: NETWORK_HOST_NAME,
                    Port: PROXY_PORT,
                },
                command.param,
            );
            assert(testCommand(<CommandResult>param) === command.result);
        });
    });
});
