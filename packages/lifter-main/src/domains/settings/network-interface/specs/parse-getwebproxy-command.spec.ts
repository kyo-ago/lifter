import * as assert from "assert";
import "mocha";
import { getMockWebproxyState } from "../../../../../tests/mocks/require-mocks/exec-commands/set-proxy-setting-state";
import { CommandResult, ParseGetwebproxyCommand } from "./parse-getwebproxy-command";

describe("ParseGetwebproxyCommand", () => {
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
            let result = ParseGetwebproxyCommand(getMockWebproxyState(command.param));
            assert(result === command.result);
        });
    });
});
