import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('button');

interface IProps {
    text: string;
    onClick: () => void;
    type?: 'light';
}

export class Button extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()} onClick={this.props.onClick}>
                <div className={`${b('container')} ${this.props.type === 'light' ? b('light') : ''}`}>
                    {this.props.text}
                </div>
            </div>
        );
    }
}
