import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBox} from './auto-responder-box'
import {InitLoader} from './init-loader'
import AppActions from '../actions/index'

class App extends React.Component<{}, {}> {
    onLoad() {
        console.log(111111111);
    }
    render() {
        return <div>
            <InitLoader onLoad="this.onLoad.bind(this)" />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

export default connect(
    mapStateToProps
)(App);