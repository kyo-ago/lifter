import * as assert from "assert";
import "mocha";
import { getMockWebproxyState } from "../../../../../test/mocks/require-mocks/exec-commands/set-proxy-setting-state";
import { CommandResult, ParseGetwebproxyCommand } from "./parse-getwebproxy-command";

interface Command {
    param: Partial<CommandResult>;
    result: boolean;
}

describe("ParseGetwebproxyCommand", () => {
    (<Command[]>[
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
    ]).forEach((command: Command) => {
        it(JSON.stringify(command.param), () => {
            let result = ParseGetwebproxyCommand(getMockWebproxyState(command.param));
            assert(result === command.result);
        });
    });
});
