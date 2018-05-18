import * as assert from "assert";
import "mocha";
import { ParseGetAutoproxyUrl } from "./parse-get-autoproxy-url";

describe("ParseGetAutoproxyUrl", () => {
    it("success", () => {
        let result = ParseGetAutoproxyUrl(`
URL: http://127.0.0.1:8888/proxy.pac
Enabled: Yes
`);
        assert(result);
    });
    it("Enabled: No", () => {
        let result = ParseGetAutoproxyUrl(`
URL: http://127.0.0.1:8888/proxy.pac
Enabled: No
`);
        assert(!result);
    });
    it("URL: (null)", () => {
        let result = ParseGetAutoproxyUrl(`
URL: (null)
Enabled: Yes
`);
        assert(!result);
    });
    it("failed", () => {
        let result = ParseGetAutoproxyUrl(`
URL: (null)
Enabled: No
`);
        assert(!result);
    });
});
