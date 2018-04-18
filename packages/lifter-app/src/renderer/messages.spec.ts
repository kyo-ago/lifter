import * as assert from "assert";
import "mocha";
import { getLocale, messages } from "./messages";

describe("messages", () => {
    it("messages", () => {
        assert(!messages.en);
        assert(messages["en-US"]);
    });

    it("globalMessages", () => {
        assert(messages["en-US"]["delete"]);
    });

    it("getLocale", () => {
        assert(
            getLocale(<any>{
                languages: [],
                language: "en",
            }) === "en-US",
        );

        assert(
            getLocale(<any>{
                languages: [],
                language: "en-US",
            }) === "en-US",
        );

        assert(
            getLocale(<any>{
                languages: [],
                language: "ja",
            }) === "ja",
        );

        assert(
            getLocale(<any>{
                languages: [],
                language: "zh-CN",
            }) === "zh-CN",
        );
    });
});
