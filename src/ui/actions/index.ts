import {AutoResponderBoxEntry} from "../components/auto-responder-box";
import {ClientRequestBoxEntry} from "../components/client-request-box";
import {CertificateBoxStatus} from "../components/cetificate-box";

export const INIT_LOAD                 = 'INIT_LOAD';
export const FILE_DROP                 = 'FILE_DROP';
export const CLIENT_REQUEST            = 'CLIENT_REQUEST';
export const CHANGE_CERTIFICATE_STATUS = 'CHANGE_CERTIFICATE_STATUS';

export default {
    initLoad: () => {
        return {
            type: INIT_LOAD
        };
    },
    fileDrop: (autoResponderBoxEntry: AutoResponderBoxEntry) => {
        return {
            type: FILE_DROP,
            autoResponderBoxEntry
        };
    },
    clientRequest: (clientRequestEntity: ClientRequestBoxEntry) => {
        return {
            type: CLIENT_REQUEST,
            clientRequestEntity
        };
    },
    changeCirtificateStatus: (certificateBoxStatus: CertificateBoxStatus) => {
        return {
            type: CHANGE_CERTIFICATE_STATUS,
            certificateBoxStatus
        };
    },
}