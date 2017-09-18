import * as React from 'react';

export class SubmitForm extends React.Component<{
    onClickCancel(event: React.MouseEvent<HTMLButtonElement>): void;
    onClickSave(event: React.MouseEvent<HTMLButtonElement>): void;
}, {}> {
    onClickCancel(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        this.props.onClickCancel(event);
    }

    onClickSave(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        this.props.onClickSave(event);
    }

    render() {
        return <footer className="toolbar toolbar-footer form-bottom">
            <div className="toolbar-actions">
                <button className="btn btn-default" onClick={this.onClickCancel.bind(this)}>
                    Cancel
                </button>

                <button className="btn btn-primary pull-right" onClick={this.onClickSave.bind(this)}>
                    Save
                </button>
            </div>
        </footer>;
    }
}
