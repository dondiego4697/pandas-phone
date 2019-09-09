import * as React from 'react';
import {inject} from 'mobx-react';

import bevis from 'libs/bevis';

const b = bevis('not-found');

import './index.scss';

export class NotFoundPage extends React.Component<{}> {
    render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('text')}>
                        <h1>Not found</h1>
                    </div>
                </div>
            </div>
        );
    }
}
