import {AutoResponderBoxEntry} from "../components/auto-responder-box";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";

export const INIT_LOAD      = 'INIT_LOAD';
export const FILE_DROP      = 'FILE_DROP';
export const CLIENT_REQUEST = 'CLIENT_REQUEST';

export default {
    initLoad: () => {
        return {
            type: INIT_LOAD
        };
    },
    fileDrop: (autoResponderBoxEntry: AutoResponderBoxEntry[]) => {
        return {
            type: FILE_DROP,
            autoResponderBoxEntry
        };
    },
    clientRequest: (clientRequestEntity: ClientRequestEntity) => {
        return {
            type: CLIENT_REQUEST,
            clientRequestEntity
        };
    }
}