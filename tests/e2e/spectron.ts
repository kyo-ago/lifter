import {Application} from "spectron";
import * as Path from "path";

let ext = process.platform === 'win32' ? '.cmd' : '';
export const TestApplication = new Application({
    path: `${Path.join('.', 'node_modules', '.bin', 'electron')}${ext}`,
    args: [Path.join('.')]
});

afterAll(() => TestApplication.stop());