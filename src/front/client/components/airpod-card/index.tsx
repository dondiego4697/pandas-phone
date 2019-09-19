import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

import {Button} from 'client/components/button';
import {IAirpod} from 'client/models/main';
import {CardDescription} from 'client/components/card-description';
import {MockAirpod} from 'client/components/mock-airpod';
import {getAirpodDescriptionFields} from 'client/libs/description-fields';

const b = bevis('airpod-card');

interface IProps {
    airpod: IAirpod;
    buttonText: string;
    onClick?: (data: IAirpod) => void;
}

export class AirpodCard extends React.Component<IProps> {
    public render(): React.ReactNode {
        const model = this.props.airpod.series;
        const title = `AirPods series ${this.props.airpod.series}`;
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('image-container')}>
                        <MockAirpod model={model}/>
                    </div>
                    <div className={b('content-container')}>
                        <h1 className={b('title')}>{title}</h1>
                        <div className={b('description-container')}>
                            <CardDescription
                                fields={getAirpodDescriptionFields(this.props.airpod)}
                            />
                        </div>
                        {
                            this.props.onClick && <div className={b('order-button')}>
                                <Button
                                    text={this.props.buttonText}
                                    onClick={() => this.props.onClick!(this.props.airpod)}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
