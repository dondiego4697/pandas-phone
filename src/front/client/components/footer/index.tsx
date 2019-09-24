import * as React from 'react';

import bevis from '@denstep/libs/bevis';

import './index.scss';

const b = bevis('footer');

export class Footer extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('logo')}/>
                </div>
            </div>
        );
    }
}
