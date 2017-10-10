import {None, Option} from 'monapt';
import * as React from 'react';
import {connect} from 'react-redux';
import {RewriteRuleEntity} from '../../../../../domains/editing/rewrite-rule/rewrite-rule-entity';
import {ShareRewriteRuleIdentity} from '../../../../../domains/share/share-rewrite-rule/share-rewrite-rule-identity';
import {SubmitForm} from '../../../share/components/submit-form/submit-form';
import {Application} from '../../application/application';
import {LifecycleContextService} from '../../application/lifecycle-context/lifecycle-context-service';
import {Actions} from '../action';
import {StateToProps} from '../reducer';
import {RewriteRules} from './rewrite-rules/rewrite-rules';
import {TopForm} from './top-form/top-form';

class AppComponent extends React.Component<GlobalProps, {}> {
    render() {
        return <div>
            <TopForm {...this.props} />
            <RewriteRules {...this.props} />
            <SubmitForm
                onClickCancel={() => this.props.cancelAllRewriteRule()}
                onClickSave={() => this.props.saveAllRewriteRule()}
            />
        </div>;
    }
}

interface DispathProps {
    saveRewriteRule: (url: string, action: string, header: string, value: string) => void;
    deleteRewriteRule: (id: ShareRewriteRuleIdentity) => void;
    selectRewriteRule: (id: ShareRewriteRuleIdentity) => void;
    cancelRewriteRule: () => void;
    cancelAllRewriteRule: () => void;
    saveAllRewriteRule: () => void;
}

let lifecycleContextService = new LifecycleContextService();
let application = new Application(lifecycleContextService);
export const App = application;
(window as any).application = application;

export const JSONToPreloadedState = (json: any) => application.JSONToPreloadedState(json);

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    return {
        saveRewriteRule(url: string, action: string, header: string, value: string) {
            let rewriteRule: RewriteRuleEntity = application.saveRewriteRule(url, action, header, value);
            dispatch(Actions.saveRewriteRule(rewriteRule));
        },

        deleteRewriteRule(id: ShareRewriteRuleIdentity) {
            let rewriteRules: RewriteRuleEntity[] = application.deleteRewriteRule(id);
            dispatch(Actions.updateRewriteRules(rewriteRules));
        },

        selectRewriteRule(id: ShareRewriteRuleIdentity) {
            let rewriteRuleEntity: Option<RewriteRuleEntity> = application.selectRewriteRule(id);
            dispatch(Actions.updateCurrentRewriteRule(rewriteRuleEntity));
        },

        cancelRewriteRule() {
            application.cancelRewriteRule();
            dispatch(Actions.updateCurrentRewriteRule(None));
        },

        cancelAllRewriteRule() {
            application.cancelAllRewriteRule();
        },

        saveAllRewriteRule() {
            application.saveAllRewriteRule();
        },
    };
}

export const Index = connect(
    (state: StateToProps) => state,
    mapDispatchToProps,
)(AppComponent);

export interface GlobalProps extends DispathProps, StateToProps {}
