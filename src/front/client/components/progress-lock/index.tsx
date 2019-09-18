import * as React from 'react';

import bevis from 'libs/bevis';

import {ProgressBar} from 'client/components/progress-bar';

import './index.scss';

const b = bevis('progress-lock');

interface IProps {
    show: boolean;
}

export class ProgressLock extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={`${b()} ${this.props.show ? '' : b('hidden')}`}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <ProgressBar/>
                    </div>
                </div>
            </div>
        );
    }
}
