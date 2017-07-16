import * as React from "react";
import {connect} from "react-redux";
import {Application} from "../../application/application";
import {Actions} from "../action";
import {TopForm} from "./top-form/top-form";
import {RewriteRules} from "./rewrite-rules/rewrite-rules";
import {SubmitForm} from "./submit-form/submit-form";
import {RewriteRuleEntity} from "../../../share/rewrite-rule/rewrite-rule-entity";

class App extends React.Component<GlobalProps, any> {
    render() {
        return <div>
            <TopForm {...this.props} />
            <RewriteRules {...this.props} />
            <SubmitForm {...this.props} />
        </div>;
    }
}

export interface StateToProps {
    rewriteRules: RewriteRuleEntity[],
}

interface DispathProps {
    saveRewriteRule: (action: string, header: string, value: string) => void;
    
}

function mapDispatchToProps(dispatch: Dispath): DispathProps {
}

export default connect(
    (state: StateToProps) => state,
    mapDispatchToProps,
)(App);

export interface GlobalProps extends DispathProps, StateToProps {}
