import { app } from "electron";

// app === undefined is test env(node)
let userDataPath = app ? app.getPath("userData") : ".";

export const NETWORK_SETUP_COMMAND = "/usr/sbin/networksetup";
export const SECURITY_COMMAND = "/usr/bin/security";
export const USER_DATA_PATH = userDataPath;
export const REPOSITORY_BASE_DIR_PATH = `${userDataPath}/Repositories`;
export const WINDOW_STATE_DIR = "WindowStates/";
export const WindowManagerInit = {
    defaultSetup: {
        defaultWidth: 1000,
        defaultHeight: 800,
        acceptFirstMouse: true
    }
};
