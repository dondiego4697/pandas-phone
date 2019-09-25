import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('card-item');

interface IProps {
    imageElement: React.ReactElement;
    contentElement: React.ReactElement;
}

export class CardItem extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('image-container')}>
                        {this.props.imageElement}
                    </div>
                    <div className={b('content-container')}>
                        {this.props.contentElement}
                    </div>
                </div>
            </div>
        );
    }
}
