import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('devider');

interface IProps {}

export class Devider extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <hr/>
                </div>
            </div>
        );
    }
}
