import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBox, AutoResponderBoxEntry} from './auto-responder-box'
import {InitLoader} from './init-loader'
import AppActions from '../actions/index'
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";

class App extends React.Component<any, any> {
    render() {
        return <div>
            <InitLoader
                onLoad={this.props.onLoad.bind(this)}
                onFileDrop={this.props.onFileDrop.bind(this)}
                onClientRequest={this.props.onClientRequest.bind(this)}
            />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    return {
        onLoad: () => {
            dispatch(AppActions.initLoad());
        },
        onFileDrop: (autoResponderBoxEntry: AutoResponderBoxEntry[]) => {
            dispatch(AppActions.fileDrop(autoResponderBoxEntry));
        },
        onClientRequest: (clientRequestEntity: ClientRequestEntity) => {
            dispatch(AppActions.clientRequest(clientRequestEntity));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);