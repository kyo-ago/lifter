import * as Datastore from "nedb";
import { promisify } from "util";

export abstract class AsyncNedbIdGenerator {
    private datastore: Datastore;
    private identity = 0;
    private timeout = 0;
    private keyName = "currentCount";

    private find: (query: any) => Promise<any[]>;
    private update: (query: any, value: any, option: any) => Promise<any>;
    private loadDatabase: () => Promise<void>;

    constructor(dataStoreOptions: Datastore.DataStoreOptions) {
        this.datastore = new Datastore(dataStoreOptions);
        this.find = promisify(this.datastore.find.bind(this.datastore));
        this.update = promisify(this.datastore.update.bind(this.datastore));
        this.loadDatabase = promisify(this.datastore.loadDatabase.bind(this.datastore));
    }

    async load() {
        await this.loadDatabase();
        let line = await this.find({ name: this.keyName });
        if (line.length) {
            this.identity = line.shift()["count"];
            return;
        }
        return this.upsertCurrentId();
    }

    protected getNextIdNumber() {
        this.upsertCurrentId();
        return this.identity++;
    }

    private upsertCurrentId() {
        if (this.timeout) return;
        this.timeout = setTimeout(() => {
            this.timeout = 0;
            // ignore promise
            return this.update(
                { name: this.keyName },
                {
                    name: this.keyName,
                    count: this.identity,
                },
                { upsert: true },
            );
        });
    }
}
