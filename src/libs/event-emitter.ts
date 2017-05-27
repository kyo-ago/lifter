import {EventEmitter2} from "eventemitter2";

interface EventEmitterMap {
    "clickCertificateStatus": void;
    "clickProxySettingStatus": void;
    "contextmenuClientRequest": void;
}

export var eventEmitter = new class EventEmitter {
    private event: EventEmitter2;

    constructor() {
        this.event = new EventEmitter2({
            wildcard: true,
        });
    }

    addListener<K extends keyof EventEmitterMap>(type: K, listener: (ev?: EventEmitterMap[K]) => void): void {
        this.event.addListener(type, listener);
    }

    emit<K extends keyof EventEmitterMap>(type: K, ev?: EventEmitterMap[K]): void {
        ev ? this.event.emit(type, ev) : this.event.emit(type);
    }
};
