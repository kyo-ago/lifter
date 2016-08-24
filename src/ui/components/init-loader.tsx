import * as React from "react";

export class InitLoader extends React.Component<any, any> {
    static propTypes = {
        onLoad: React.PropTypes.func.isRequired
    };

    componentWillMount() {
        const { onLoad } = this.props;
        onLoad();
    }

    render() {
        return <span></span>;
    }
}