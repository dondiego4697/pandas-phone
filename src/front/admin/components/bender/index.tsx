import * as React from 'react';
import {Link} from 'react-router-dom';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('bender');

export class Bender extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Link
                    className={b('img')}
                    to='/bender-root'
                />
            </div>
        );
    }
}
