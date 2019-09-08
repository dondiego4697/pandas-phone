import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('table-title');

interface Props {
    value: string;
}

export default class TableTitle extends React.Component<Props> {
    render(): React.ReactNode {
        return (
            <div className={b()}>
                <h1>{this.props.value}</h1>
            </div>
        );
    }
}
