import {EventEmitter2 as EventEmitter} from "eventemitter2";

interface EventMap {
    "clickCertificateStatus": void;
    "clickProxySettingStatus": void;
}

export class eventEmitter {
    private static _instance:eventEmitter = null;
    event: any;

    constructor() {
        this.event = new EventEmitter({
            wildcard: true,
        });
    }

    static getInstance() {
        if(eventEmitter._instance === null) {
            eventEmitter._instance = new eventEmitter();
        }
        return eventEmitter._instance;
    }

    static addListener<K extends keyof EventMap>(type: K, listener: (ev?: EventMap[K]) => void): void {
        let instance = eventEmitter.getInstance();
        instance.event.addListener(type, listener);
    }

    static emit<K extends keyof EventMap>(type: K, ev?: EventMap[K]): void {
        let instance = eventEmitter.getInstance();
        ev ? instance.event.emit(type, ev) : instance.event.emit(type);
    }
}
