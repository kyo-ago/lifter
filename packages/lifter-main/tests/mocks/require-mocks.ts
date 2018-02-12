import { NetworkMockStateEvent } from "./network-mock-state-event";
import "./require-mocks/@lifter/networksetup-proxy";
import "./require-mocks/electron-ipc";
import "./require-mocks/exec-commands";
import "./require-mocks/http-mitm-proxy";

NetworkMockStateEvent.emit("updateCertificateState", "missing");
NetworkMockStateEvent.emit("updateProxyingState", "Unknown");

export function RequireMocks() {}
