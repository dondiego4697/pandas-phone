import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('bender');

export class Bender extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('img')}/>
            </div>
        );
    }
}
