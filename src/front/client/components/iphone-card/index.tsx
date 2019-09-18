import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';
import {MockIphone} from 'client/components/mock-iphone';
import {Button} from 'client/components/button';
import {IIphone} from 'client/models/main';
import {iPhoneModelMapper, iPhoneColorMapper, getPrice} from 'client/libs/text-mapper';
import {CardDescription, ICardDescriptionField} from 'client/components/card-description';

const b = bevis('iphone-card');

interface IProps {
    iphone: IIphone;
    buttonText: string;
    onClick?: (data: IIphone) => void;
}

function getFields(iphone: IIphone): ICardDescriptionField[] {
    const fields: ICardDescriptionField[] = [
        {
            icon: 'brush',
            text: iPhoneColorMapper(iphone.color)!
        },
        {
            icon: 'storage',
            text: `${iphone.memory} GB`
        },
        {
            icon: 'ruble',
            text: getPrice(iphone.price, 0),
            textClassName: iphone.discount > 0 ? 'old-price' : 'price'
        }
    ];

    if (iphone.discount > 0) {
        fields.push({
            icon: 'discount',
            text: getPrice(iphone.price, iphone.discount),
            textClassName: 'discount'
        });
    }

    return fields;
}

export class IphoneCard extends React.Component<IProps> {
    public render(): React.ReactNode {
        const model = `${this.props.iphone.model}_${this.props.iphone.color}`;
        const title = `iPhone ${iPhoneModelMapper(this.props.iphone.model)}`;
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('image-container')}>
                        <MockIphone model={model}/>
                    </div>
                    <div className={b('content-container')}>
                        <h1 className={b('title')}>{title}</h1>
                        <div className={b('description-container')}>
                            <CardDescription
                                fields={getFields(this.props.iphone)}
                            />
                        </div>
                        {
                            this.props.onClick && <div className={b('order-button')}>
                                <Button
                                    text={this.props.buttonText}
                                    onClick={() => this.props.onClick!(this.props.iphone)}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
