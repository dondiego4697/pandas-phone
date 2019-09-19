import * as React from 'react';
import {inject, observer} from 'mobx-react';

import bevis from 'libs/bevis';
import {CartPageModel} from 'client/models/cart';
import {ClientDataModel} from 'client/models/client-data';
import {PageStatus} from 'libs/types';
import {ProgressLock} from 'client/components/progress-lock';
import {Header} from 'client/components/header';
import {IphoneCart} from 'client/components/cart-item/iphone';
import {AirpodCart} from 'client/components/cart-item/airpod';
import {IIphone, IAirpod} from 'client/models/main';
import {EditText} from 'client/components/edit-text';
import {Button} from 'client/components/button';

import './index.scss';

const b = bevis('cart');

interface IProps {
    clientDataModel?: ClientDataModel;
    cartPageModel?: CartPageModel;
}

@inject('cartPageModel', 'clientDataModel')
@observer
export class CartPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.cartPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <ProgressLock show={this.props.cartPageModel!.status === PageStatus.LOADING}/>
                    <Header budgeCount={this.props.cartPageModel!.cartCount}/>
                    <div className={b('wrapper')}>
                        <div className={b('cart-items-container')}>
                            {
                                this.props.cartPageModel!.data.iphones.map((iphone, i) => {
                                    return <IphoneCart
                                        key={`iphone-cart-key-${i}`}
                                        iphone={iphone}
                                        onDelete={this.onDeleteIphoneHandler}
                                    />;
                                })
                            }
                            {
                                this.props.cartPageModel!.data.airpods.map((airpod, i) => {
                                    return <AirpodCart
                                        key={`airpod-cart-key-${i}`}
                                        airpod={airpod}
                                        onDelete={this.onDeleteAirpodHandler}
                                    />;
                                })
                            }
                        </div>
                    </div>
                    <div className={b('info')}>
                        <h1>{`Всего на сумму: ${this.props.cartPageModel!.totalPrice}`}</h1>
                        <div className={b('info-details')}>
                            <p>Оставьте ваш номер телефона и мы вам перезвоним, чтобы подтвердить заказ.</p>
                            <p>Сейчас вы ни за что не платите.</p>
                        </div>
                        <div className={b('info-form')}>
                            <div className={b('edit-text-wrap')}>
                                <EditText
                                    id='customer-name'
                                    value={this.props.cartPageModel!.customerData.name}
                                    onChange={this.editTextChangeHandler}
                                    placeholder='Как к вам обращаться'
                                    label='Как к вам обращаться'
                                />
                            </div>
                            <div className={b('edit-text-wrap')}>
                                <EditText
                                    id='customer-phone'
                                    value={this.props.cartPageModel!.customerData.phone}
                                    onChange={this.editTextChangeHandler}
                                    placeholder='Ваш телефон'
                                    label='Ваш телефон'
                                />
                            </div>
                            <div className={b('edit-text-wrap')}>
                                <Button
                                    text='Оставить заказ'
                                    onClick={this.onSendRequestHandler}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private editTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const {id, value} = event.target;
        if (id === 'customer-name') {
            this.props.cartPageModel!.setCustomerName(value);
        } else if (id === 'customer-phone') {
            this.props.cartPageModel!.setCustomerPhone(value);
        }
    }

    private onSendRequestHandler = (): void => {
        if (this.props.cartPageModel!.validateCustomerData()) {
            // TODO
            // 1. send-request
            // 2. if ok -> clear cookie
            // 3. open popup that everything is okay -> на любую кнопку открываем main-page
        } else {
            // TODO
            // по хорошему возвращать ошибку и какое поле багнуло
        }
    }

    private onDeleteIphoneHandler = (iphone: IIphone): void => {
        this.props.cartPageModel!.removeIphone(iphone);
    }

    private onDeleteAirpodHandler = (airpod: IAirpod): void => {
        this.props.cartPageModel!.removeAirpod(airpod);
    }
}
