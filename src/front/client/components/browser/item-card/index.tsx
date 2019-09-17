import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';
import {BrowserIphoneMock} from 'client/components/browser/iphone-mock';
import {BrowserAirpodsMock} from 'client/components/browser/airpods-mock';
import {BrowserButton} from 'client/components/browser/button';

const b = bevis('browser-item-card');

interface IProps {
    id: string;
    model: string;
    header: string;
    type: 'iphone' | 'airpods';
    description?: string;

    price: number;
    discount: number;

    onAddToCart: (id: string) => void;
}

function getPrice(price: number, discount: number): string {
    return (price * (1 - discount / 100)).toFixed(2);
}

export class BrowserItemCard extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('image-container')}>
                        {this.props.type === 'iphone' && <BrowserIphoneMock model={this.props.model}/>}
                        {this.props.type === 'airpods' && <BrowserAirpodsMock model={this.props.model}/>}
                    </div>
                    <div className={b('content-container')}>
                        <h1 className={b('title')}>{this.props.header}</h1>
                        <p className={b('description')}>{this.props.description || ''}</p>
                        <div className={b('price-container')}>
                            <p className={`${b('price')} ${this.props.discount > 0 && 'old-price'}`}>{
                                getPrice(this.props.price, 0)
                            }</p>
                            {this.props.discount > 0 && <p className={b('discount-price')}>
                                {`${getPrice(this.props.price, this.props.discount)} [${this.props.discount}%]`}
                            </p>}
                        </div>
                        <div className={b('order-button')}>
                            <BrowserButton
                                text='Добавить в корзину'
                                onClick={() => {
                                    this.props.onAddToCart(this.props.id)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
