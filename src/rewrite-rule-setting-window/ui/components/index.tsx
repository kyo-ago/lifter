import {None, Option} from "monapt";
import * as React from "react";
import {connect} from "react-redux";
import {ShareRewriteRuleIdentity} from "../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {Application} from "../../application/application";
import {LifecycleContextService} from "../../application/lifecycle-context/lifecycle-context-service";
import {RewriteRuleEntity} from "../../domain/rewrite-rule/rewrite-rule-entity";
import {Actions} from "../action";
import {StateToProps} from "../reducer";
import {RewriteRules} from "./rewrite-rules/rewrite-rules";
import {SubmitForm} from "./submit-form/submit-form";
import {TopForm} from "./top-form/top-form";

class App extends React.Component<GlobalProps, {}> {
    render() {
        return <div>
            <TopForm {...this.props} />
            <RewriteRules {...this.props} />
            <SubmitForm {...this.props} />
        </div>;
    }
}

interface DispathProps {
    saveRewriteRule: (action: string, header: string, value: string) => void;
    deleteRewriteRule: (id: ShareRewriteRuleIdentity) => void;
    selectRewriteRule: (id: ShareRewriteRuleIdentity) => void;
    cancelRewriteRule: () => void;
    cancelAllRewriteRule: () => void;
    saveAllRewriteRule: () => void;
}

let lifecycleContextService = new LifecycleContextService();
let application = new Application(lifecycleContextService);

export function RewriteRuleFactoryFromJSON(json: any) {
    return lifecycleContextService.rewriteRuleFactory.fromJSON(json);
}

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    return {
        saveRewriteRule(action: string, header: string, value: string) {
            let rewriteRule: RewriteRuleEntity = application.saveRewriteRule(action, header, value);
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
)(App);

export interface GlobalProps extends DispathProps, StateToProps {}
