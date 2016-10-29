import * as React from "react";

export class ToolbarHeader extends React.Component<{}, {}> {
    render() {
        return (
            <header className="toolbar toolbar-header">
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <button className="btn btn-default">
                            <span className="icon icon-home"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-folder"></span>
                        </button>
                        <button className="btn btn-default active">
                            <span className="icon icon-cloud"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-popup"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-shuffle"></span>
                        </button>
                    </div>
                </div>
            </header>
        );
    }
}