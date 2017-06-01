import * as React from "react";
import {connect} from "react-redux";
import {WindowContent} from "./window-content";
import {ToolbarHeader} from "./toolbar-header";
import {Application} from "../../application/application";

class App extends React.Component<any, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    let application = new Application(window);
    application.bindEvents(dispatch);
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);