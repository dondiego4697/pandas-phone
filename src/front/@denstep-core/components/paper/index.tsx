import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('paper');

interface IProps {}

export class Paper extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
