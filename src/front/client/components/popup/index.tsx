import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('popup');

interface IProps {
    onClose: () => void;
    show: boolean;
}

export class Popup extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={`${b()} ${this.props.show ? '' : b('hidden')}`}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <div className={b('cross-container')} onClick={this.props.onClose}>
                            <div className={b('cross')}/>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
