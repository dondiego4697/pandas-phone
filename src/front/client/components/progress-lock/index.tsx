import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import {ProgressBar} from 'client/components/progress-bar';

import './index.scss';

const b = bevis('progress-lock');

interface IProps {
    show: boolean;
    transparent?: boolean;
}

export class ProgressLock extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div
                className={
                    `${b()} ${this.props.show ? '' : b('hidden')} ` +
                    `${this.props.transparent ? b('transparent') : ''}`
                }
            >
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <ProgressBar/>
                    </div>
                </div>
            </div>
        );
    }
}
