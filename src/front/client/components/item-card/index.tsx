import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';
import {IphoneMock} from 'client/components/iphone-mock';
import {AirpodsMock} from 'client/components/airpods-mock';
import {Button} from 'client/components/button';

const b = bevis('item-card');

interface IProps {
    callbackData: string;
    model: string;
    title: string;
    type: 'iphone' | 'airpods';
    onAddToCart: (id: string) => void;
}

export class ItemCard extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('image-container')}>
                        {this.props.type === 'iphone' && <IphoneMock model={this.props.model}/>}
                        {this.props.type === 'airpods' && <AirpodsMock model={this.props.model}/>}
                    </div>
                    <div className={b('content-container')}>
                        <h1 className={b('title')}>{this.props.title}</h1>
                        <div className={b('description-container')}>
                            {this.props.children}
                        </div>
                        <div className={b('order-button')}>
                            <Button
                                text='Добавить в корзину'
                                onClick={() => {
                                    this.props.onAddToCart(this.props.callbackData)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
