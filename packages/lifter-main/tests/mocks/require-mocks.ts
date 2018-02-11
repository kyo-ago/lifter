import "./require-mocks/@lifter/networksetup-proxy";
import "./require-mocks/electron-ipc";
import "./require-mocks/exec-commands";
import "./require-mocks/http-mitm-proxy";
import { NetworkMockStateEvent } from "./network-mock-state-event";

NetworkMockStateEvent.emit("updateCertificateState", "missing");
NetworkMockStateEvent.emit("updateProxyingState", "NoPermission");

export function RequireMocks() {}
