import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('screen-locker');

interface IProps {
    preset: '#blue';
}

export class ScreenLocker extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={classnames(b('container'), {
                    [b('preset_blue')]: this.props.preset === '#blue'
                })}>
                    {
                        (new Array(9))
                            .fill(true)
                            .map((_, i) => <div key={`key-progress-bar-item-${i}`}/>)
                    }
                </div>
            </div>
        );
    }
}
