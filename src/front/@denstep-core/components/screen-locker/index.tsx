import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('screen-locker');

interface IProps {
    transparent?: boolean;
    show?: boolean;
}

export class ScreenLocker extends React.Component<IProps> {
    public render(): React.ReactNode {
        document.body.style.overflow = this.props.show ? 'hidden' : 'scroll';

        return (
            <div className={classnames(b(), {
                ['transparent']: this.props.transparent,
                ['hidden']: !this.props.show
            })}>
                <div className={classnames(b('container'), {
                    [b('blue')]: true
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
