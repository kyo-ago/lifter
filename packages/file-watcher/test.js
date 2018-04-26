const fs = require("fs");
const assert = require("assert");
const sinon = require("sinon");
const watch = require("./");

describe("file-watch", () => {
    let testFileName = `${__dirname}/test.tmp`;
    afterEach(() => {
        fs.existsSync(testFileName) && fs.unlinkSync(testFileName);
    });
    let waitFor = (check) => {
        return new Promise((resolve) => {
            let interva = setInterval(() => {
                if (check()) {
                    return;
                }
                clearInterval(interva);
                resolve();
            }, 5);
        });
    };

    it("watch", () => {
        let spy = sinon.spy();
        let unwatch = watch(__filename, spy);
        unwatch();
        assert(!spy.called);
    });

    it("create", async () => {
        let spy = sinon.spy();
        let unwatch = watch(testFileName, spy, 0);
        fs.writeFileSync(testFileName, "hoge");
        await waitFor(() => !spy.called);
        unwatch();
        assert(spy.called);
    });

    it("write", async () => {
        let spy = sinon.spy();
        fs.writeFileSync(testFileName, "hoge");
        let unwatch = watch(testFileName, spy, 0);
        fs.writeFileSync(testFileName, "huga");
        await waitFor(() => !spy.called);
        unwatch();
        assert(spy.called);
    });

    it("unlink", async () => {
        let spy = sinon.spy();
        fs.writeFileSync(testFileName, "hoge");
        let unwatch = watch(testFileName, spy, 0);
        fs.unlinkSync(testFileName);
        await waitFor(() => !spy.called);
        unwatch();
        assert(spy.called);
    });

    it("rename", async () => {
        let newPath = `${__dirname}/test1.tmp`;
        let spy = sinon.spy();
        fs.writeFileSync(testFileName, "hoge");
        let unwatch = watch(testFileName, spy, 0);
        fs.renameSync(testFileName, newPath);
        await waitFor(() => !spy.called);
        unwatch();
        assert(spy.called);
        fs.unlinkSync(newPath);
    });

    it("ignore other file", async () => {
        let newPath = `${__dirname}/test1.tmp`;
        let spy = sinon.spy();
        let unwatch = watch(testFileName, spy, 0);
        fs.writeFileSync(newPath, "hoge");
        await new Promise((resolve) => setTimeout(resolve, 50));
        unwatch();
        assert(!spy.called);
        fs.unlinkSync(newPath);
    });
});
