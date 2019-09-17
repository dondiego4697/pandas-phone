import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('browser-iphone-mock');

interface IProps {
    model: string;
}

export class BrowserIphoneMock extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('image-wrapper')}>
                    <div className={b('phone')}>
                        <img
                            className={b('phone-frame')}
                            src={`/public/imgs/iphone-mock/${this.createImageName(this.props.model)}`}
                        />
                        <div className={b('phone-bg')}/>
                    </div>
                </div>
            </div>
        );
    }

    private createImageName(model: string): string {
        return `${model.toLowerCase().split(' ').join('_')}.png`;
    }
}
