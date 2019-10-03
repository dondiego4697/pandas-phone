import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('image-button');

interface IProps {
    onClick: () => void;
}

export class ImageButton extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()} onClick={this.props.onClick}>
                <div className={b('container')}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
