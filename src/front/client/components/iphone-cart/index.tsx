import * as React from 'react';

import bevis from 'libs/bevis';

import {IIphone} from 'client/models/main';
import {iPhoneModelMapper} from 'client/libs/text-mapper';
import {CardDescription} from 'client/components/card-description';
import {getIphoneDescriptionFields} from 'client/libs/description-fields';
import {MockIphone} from 'client/components/mock-iphone';
import {CartItem} from 'client/components/cart-item';

import './index.scss';

const b = bevis('iphone-cart');

interface IProps {
    iphone: IIphone;
    onDelete: (iphone: IIphone) => void;
}

export class IphoneCart extends React.Component<IProps> {
    public render(): React.ReactNode {
        const title = `iPhone ${iPhoneModelMapper(this.props.iphone.model)}`;
        return (
            <CartItem onDelete={() => this.props.onDelete(this.props.iphone)}>
                    <div className={b('wrapper')}>
                        <div className={b('image-container')}>
                            <MockIphone model={this.props.iphone.model}/>
                        </div>
                        <div className={b('title')}>
                            <h1>{title}</h1>
                        </div>
                        <div className={b('content-container')}>
                            <CardDescription fields={getIphoneDescriptionFields(this.props.iphone)}/>
                        </div>
                    </div>
            </CartItem>
        );
    }
}
