import { NetworksetupProxyService } from "../../settings/networksetup-proxy-service/networksetup-proxy-service";
import { AutoResponderEntryRepository } from "../auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
export declare class PacFileService {
    private autoResponderEntryRepository;
    private networksetupProxyService;
    constructor(
        autoResponderEntryRepository: AutoResponderEntryRepository,
        networksetupProxyService: NetworksetupProxyService
    );
    load(): Promise<void>;
    getContent(): Promise<string>;
}
