import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('progress-bar');

export class ProgressBar extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <CircularProgress />
                </div>
            </div>
        );
    }
}
