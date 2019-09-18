import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

import {Button} from 'client/components/button';
import {IAirpod} from 'client/models/main';
import {getPrice, airpodOriginalMapper, airpodChargingMapper} from 'client/libs/text-mapper';
import {CardDescription, ICardDescriptionField} from 'client/components/card-description';
import {MockAirpod} from 'client/components/mock-airpod';

const b = bevis('airpod-card');

interface IProps {
    airpod: IAirpod;
    buttonText: string;
    onClick?: (data: IAirpod) => void;
}

function getFields(airpod: IAirpod): ICardDescriptionField[] {
    const fields: ICardDescriptionField[] = [
        {
            icon: 'copyright',
            text: airpodOriginalMapper(airpod.original)
        },
        {
            icon: 'charge',
            text: airpodChargingMapper(airpod.original)
        },
        {
            icon: 'ruble',
            text: getPrice(airpod.price, 0),
            textClassName: airpod.discount > 0 ? 'old-price' : 'price'
        }
    ];

    if (airpod.discount > 0) {
        fields.push({
            icon: 'discount',
            text: getPrice(airpod.price, airpod.discount),
            textClassName: 'discount'
        });
    }

    return fields;
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
                                fields={getFields(this.props.airpod)}
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
