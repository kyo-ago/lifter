import * as React from "react";

export const AutoResponderBox = React.createClass({
    render: () => {
        let entries = this.props.entries.map((entry: any) => {
            return (
                <div>
                    <span>{entry.pattern}</span>
                    <span>{entry.path}</span>
                    <span>{entry.type}</span>
                </div>
            );
        });
        return (
            <div className="entries">
                {entries}
            </div>
        );
    }
});
