import * as React from 'react';
import {inject} from 'mobx-react';

import bevis from 'libs/bevis';

const b = bevis('not-found');

import {Bender} from 'admin/components/bender';

import './index.scss';

export class NotFoundPage extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    <div className={b('text')}>
                        <h1>Not found</h1>
                    </div>
                </div>
            </div>
        );
    }
}
