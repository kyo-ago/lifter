import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBox} from './auto-responder-box'
import {InitLoader} from './init-loader'
import AppActions from '../actions/index'

class App extends React.Component<any, any> {
    render() {
        return <div>
            <InitLoader onLoad={this.props.onLoad.bind(this)} />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    return {
        onLoad: () => {
            console.log("onLoad");
            dispatch(AppActions.initLoad());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);