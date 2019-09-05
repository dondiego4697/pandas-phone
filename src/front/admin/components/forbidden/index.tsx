import * as React from 'react';

import bevis from 'lib/bevis';

import './index.scss';

const b = bevis('forbidden-container');

export class Forbidden extends React.Component<{}, {}> {
    render() {
        return (
            <div className={b('text')}>
                <h1>Forbidden</h1>
            </div>
        );
    }
}

