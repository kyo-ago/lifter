import {EventEmitter2 as EventEmitter} from "eventemitter2";

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

    static addListener(...args: any[]) {
        let instance = eventEmitter.getInstance();
        instance.event.addListener.apply(instance.event, args);
    }

    static emit(...args: any[]) {
        let instance = eventEmitter.getInstance();
        instance.event.emit.apply(instance.event, args);
    }
}

