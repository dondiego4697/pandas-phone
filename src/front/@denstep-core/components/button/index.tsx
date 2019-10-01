import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('button');

interface IProps {
    text: string;
    onClick: () => void;
    preset?: '#light';
}

export class Button extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()} onClick={this.props.onClick}>
                <div className={classnames(b('container'), {
                    [b('light')]: this.props.preset === '#light'
                })}>
                    {this.props.text}
                </div>
            </div>
        );
    }
}
