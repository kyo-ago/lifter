import * as assert from "assert";
import "mocha";
import { getLocale, messages } from "./messages";

describe("messages", () => {
    it("messages", () => {
        assert(!messages.en);
        assert(messages["en-US"]);
    });

    it("getLocale", () => {
        assert(
            getLocale({
                languages: [],
                language: "en",
            }) === "en-US",
        );

        assert(
            getLocale({
                languages: [],
                language: "en-US",
            }) === "en-US",
        );

        assert(
            getLocale({
                languages: [],
                language: "ja",
            }) === "ja",
        );

        assert(
            getLocale({
                languages: [],
                language: "zh-CN",
            }) === "zh-CN",
        );
    });
});
