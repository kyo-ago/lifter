import * as React from "react";
import {connect} from "react-redux";
import {Application} from "../../application/application";
import {LifecycleContextService} from "../../application/lifecycle-context/lifecycle-context-service";
import {StateToProps} from "../reducer";

class AppComponent extends React.Component<GlobalProps, {}> {
    render() {
        return <div>
        </div>;
    }
}

interface DispathProps {
    cancelAll: () => void;
    saveAll: () => void;
}

let lifecycleContextService = new LifecycleContextService();
let application = new Application(lifecycleContextService);
export const App = application;
(window as any).application = application;

export function JSONToEntity(json: any) {
    return lifecycleContextService.proxyBypassDomainFactory.fromJSON(json);
}

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    return {
        cancelAll() {
            application.cancelAll();
        },

        saveAll() {
            application.saveAll();
        },
    };
}

export const Index = connect(
    (state: StateToProps) => state,
    mapDispatchToProps,
)(AppComponent);

export interface GlobalProps extends DispathProps, StateToProps {}
