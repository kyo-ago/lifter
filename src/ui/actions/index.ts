import {StateToProps} from "../components/index";

export interface Action {
    type: string;
    render: StateToProps;
}

export const RENDER = 'RENDER';

export var Actions = {
    render: (render: StateToProps): Action => {
        return {
            type: RENDER,
            render
        };
    },
};
