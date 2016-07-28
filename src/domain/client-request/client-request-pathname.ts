import {Url} from "url";

export class ClientRequestPathname {
    private value: string;

    constructor(
        url: Url,
    ) {
        this.value = url.pathname;
    }

    getValue() {
        return this.value;
    }
}