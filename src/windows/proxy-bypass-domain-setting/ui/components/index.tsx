import * as React from 'react';
import {connect} from 'react-redux';
import {SubmitForm} from '../../../../contexts/share/ui/components/submit-form/submit-form';
import {Application} from '../../application/application';
import {LifecycleContextService} from '../../application/lifecycle-context/lifecycle-context-service';
import {Actions} from '../action';
import {StateToProps} from '../reducer';
import {Form} from './form';

class AppComponent extends React.Component<GlobalProps, {}> {
    render() {
        return <div>
            <Form {...this.props} />
            <SubmitForm
                onClickCancel={(event: any) => this.props.cancelAll()}
                onClickSave={(event: any) => this.props.saveAll()}
            />
        </div>;
    }
}

interface DispathProps {
    updateEntities: (formText: string) => void;
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
        updateEntities(formText: string) {
            let entities = application.updateEntities(formText);
            dispatch(Actions.updateProxyBypassDomains(entities));
        },

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
