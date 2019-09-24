import * as React from 'react';

import bevis from '@denstep/libs/bevis';
import {Bender} from 'admin/components/bender';

import './index.scss';

const b = bevis('table-title');

interface IProps {
    value: string;
}

export class TableTitle extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Bender/>
                <h1>{this.props.value}</h1>
            </div>
        );
    }
}
