import * as mockRequire from "mock-require";
import * as Datastore from "nedb";

/**
 * This is constructor mock.
 * require Function object(not allow function)
 */
mockRequire("nedb", function (option: Datastore.DataStoreOptions) {
    option.inMemoryOnly = true;
    return new Datastore(option);
});
