import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import {IAirpod} from 'client/models/main';
import {CardDescription} from 'client/components/card-description';
import {getAirpodDescriptionFields} from 'client/libs/description-fields';
import {MockAirpod} from 'client/components/mock/airpod';
import {CartItem} from 'client/components/cart-item';

import './index.scss';

const b = bevis('airpod-cart');

interface IProps {
    airpod: IAirpod;
    onDelete: (airpod: IAirpod) => void;
}

export class AirpodCart extends React.Component<IProps> {
    public render(): React.ReactNode {
        const title = `AirPods ${this.props.airpod.series}`;
        return (
            <CartItem onDelete={() => this.props.onDelete(this.props.airpod)}>
                <div className={b('wrapper')}>
                    <div className={b('image-container')}>
                        <MockAirpod model={this.props.airpod.series}/>
                    </div>
                    <div className={b('title')}>
                        <h1>{title}</h1>
                    </div>
                    <div className={b('content-container')}>
                        <CardDescription fields={getAirpodDescriptionFields(this.props.airpod)}/>
                    </div>
                </div>
            </CartItem>
        );
    }
}
