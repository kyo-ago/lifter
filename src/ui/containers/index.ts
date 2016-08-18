import React from 'react'
import {connect} from 'react-redux'
import {AutoResponderBox} from '../components/auto-responder-box'
import AppActions from '../actions/index'

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {
        handleClick: () => { dispatch(AppActions.increment()) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoResponderBox)