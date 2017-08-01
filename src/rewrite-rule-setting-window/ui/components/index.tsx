import * as React from "react";
import {connect} from "react-redux";
import {Application} from "../../application/application";
import {TopForm} from "./top-form/top-form";
import {RewriteRules} from "./rewrite-rules/rewrite-rules";
import {SubmitForm} from "./submit-form/submit-form";
import {ShareRewriteRuleIdentity} from "../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {StateToProps} from "../reducer";
import {Actions} from "../action";
import {Option, None, Some} from "monapt";
import {ShareRewriteRuleEntity} from "../../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ajaxGetJSON} from "@reactivex/rxjs/dist/cjs/observable/dom/AjaxObservable";

class App extends React.Component<GlobalProps, any> {
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

let application = new Application();

export function RewriteRuleFactoryFromJSON(json: any) {
    return application.rewriteRuleFactory.fromJSON(json);
}

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    return {
        saveRewriteRule(action: string, header: string, value: string) {
            application.saveRewriteRule(action, header, value).then((rewriteRule: ShareRewriteRuleEntity) => {
                dispatch(Actions.saveRewriteRule(rewriteRule));
            });
        },
        deleteRewriteRule(id: ShareRewriteRuleIdentity) {
            application.deleteRewriteRule(id).then((rewriteRules: ShareRewriteRuleEntity[]) => {
                dispatch(Actions.updateRewriteRules(rewriteRules));
            });
        },
        selectRewriteRule(id: ShareRewriteRuleIdentity) {
            application.selectRewriteRule(id).then((rewriteRuleEntity: Option<ShareRewriteRuleEntity>) => {
                dispatch(Actions.updateCurrentRewriteRule(rewriteRuleEntity));
            });
        },
        cancelRewriteRule() {
            application.cancelRewriteRule().then((rewriteRuleEntity: Option<ShareRewriteRuleEntity>) => {
                dispatch(Actions.updateCurrentRewriteRule(rewriteRuleEntity));
            });
        },
        cancelAllRewriteRule() {
        },
        saveAllRewriteRule() {
        },
    };
}

export default connect(
    (state: StateToProps) => state,
    mapDispatchToProps,
)(App);

export interface GlobalProps extends DispathProps, StateToProps {}
