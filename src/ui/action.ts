import {StateToProps} from "./components/index";
import {AutoResponderEntryEntity} from '../domain/auto-responder-entry/auto-responder-entry-entity';

export interface Action {
    type: string;
    render: StateToProps;
}

export const RENDER = 'RENDER';
export const FILE_DROP = 'FILE_DROP';

export var Actions = {
    fileDrop: (autoResponderEntryEntity: AutoResponderEntryEntity[]) => {
        return {
            type: FILE_DROP,
            autoResponderEntryEntity
        };
    },
    render: (render: StateToProps): Action => {
        return {
            type: RENDER,
            render
        };
    },
};
