import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

const b = bevis('not-found');

import './index.scss';

export class NotFoundPage extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <img src='/public/imgs/panda.svg'/>
                    <div className={b('text')}>
                        <h1>404</h1>
                    </div>
                </div>
            </div>
        );
    }
}
