import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('mock-airpod');

interface IProps {
    model: string;
}

export class MockAirpod extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('image-wrapper')}>
                    <img
                        className={b('frame')}
                        src={`/public/imgs/airpods-mock/${this.props.model}.png`}
                    />
                </div>
            </div>
        );
    }
}
