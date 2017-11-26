"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const async_1 = require("rxjs/scheduler/async");
const settings_1 = require("../../../settings");
class PacFileService {
    constructor(autoResponderEntryRepository, networksetupProxyService) {
        this.autoResponderEntryRepository = autoResponderEntryRepository;
        this.networksetupProxyService = networksetupProxyService;
    }
    async load() {
        await this.networksetupProxyService.setAutoProxyUrl();
        let observable = new Rx.Subject();
        observable
            .throttleTime(300, async_1.async, {
                leading: true,
                trailing: true
            })
            .subscribe(() => this.networksetupProxyService.reloadAutoProxyUrl());
        this.autoResponderEntryRepository.addChangeEvent(() => observable.next());
        let autoResponderEntryEntries = await this.autoResponderEntryRepository.resolveAll();
        if (autoResponderEntryEntries.length) {
            observable.next();
        }
    }
    async getContent() {
        let autoResponderEntryEntries = await this.autoResponderEntryRepository.resolveAll();
        let codeSttrings = autoResponderEntryEntries.map(autoResponderEntryEntity => {
            return autoResponderEntryEntity.pattern.getMatchCodeString(`PROXY ${settings_1.PROXY_SERVER_NAME}`);
        });
        return `
            function FindProxyForURL(url, host) {
                ${codeSttrings.join("\n")}
            	return "DIRECT";
            }
        `;
    }
}
exports.PacFileService = PacFileService;
