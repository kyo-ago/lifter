import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBox} from './auto-responder-box'
import AppActions from '../actions/index'

class App extends React.Component<{}, {}> {
    componentDidMount() {
    }

    render() {
        return <div>
            aaaaaaaaaaaaaaaaaaa
               </div>
            ;
    }
}

function mapStateToProps(state: any) {
    return state
}

function mapDispatchToProps(dispatch: any) {
    return {
        handleClick: () => { dispatch(AppActions.increment()) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);