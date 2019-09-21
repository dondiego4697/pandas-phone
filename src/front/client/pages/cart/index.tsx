import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

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
import {Popup} from 'client/components/popup';
import {MobileHeader} from 'client/components/mobile-header';

import './index.scss';

const b = bevis('cart');

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    cartPageModel?: CartPageModel;
}

@inject('cartPageModel', 'clientDataModel')
@observer
export class CartPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.cartPageModel!.fetchData();
    }

    public componentWillUnmount(): void {
        this.props.cartPageModel!.resetCusomerError();
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Popup
                    show={
                        this.props.cartPageModel!.showAddOrderErrorPopup ||
                        this.props.cartPageModel!.showAddOrderSuccessPopup
                    }
                    onClose={this.onClosePopup}
                >
                    {this.renderPopupContent()}
                </Popup>
                <ProgressLock
                    transparent={this.props.cartPageModel!.transparentProgressLock}
                    show={this.props.cartPageModel!.status === PageStatus.LOADING}
                />
                {!this.props.clientDataModel!.isMobile && this.renderBrowser()}
                {this.props.clientDataModel!.isMobile && this.renderMobile()}
            </div>
        );
    }

    private renderMobile(): React.ReactNode {
        return (
            <div className={b('container')}>
                <MobileHeader budgeCount={this.props.cartPageModel!.cartCount}/>
                {this.props.cartPageModel!.cartCount === 0 && this.renderEmptyCart()}
                {this.props.cartPageModel!.cartCount !== 0 && <div>
                    {this.renderCartItems(true)}
                    {this.renderInfoForm(true)}
                </div>}
            </div>
        );
    }

    private renderBrowser(): React.ReactNode {
        return (
            <div className={b('container')}>
                <Header budgeCount={this.props.cartPageModel!.cartCount} />
                {this.props.cartPageModel!.cartCount === 0 && this.renderEmptyCart()}
                {this.props.cartPageModel!.cartCount !== 0 && <div>
                    {this.renderCartItems()}
                    {this.renderInfoForm()}
                </div>}
            </div>
        );
    }

    private renderInfoForm(isMobile = false): React.ReactNode {
        return (
            <div className={b('info')}>
                <h1>{`Всего на сумму: ${this.props.cartPageModel!.totalPrice}`}</h1>
                <div className={b('info-details')}>
                    <p>Оставьте ваш номер телефона и мы вам перезвоним, чтобы подтвердить заказ.</p>
                    <p className='bold'>Сейчас вы ни за что не платите.</p>
                </div>
                <div className={`${b('info-form')} ${isMobile ? 'mobile' : ''}`}>
                    <div className={b('field-wrap')}>
                        <EditText
                            id='customer-name'
                            value={this.props.cartPageModel!.customerData.name}
                            onChange={this.editTextChangeHandler}
                            placeholder='Как к вам обращаться'
                            label='Как к вам обращаться'
                            errorMessage={this.props.cartPageModel!.customerError.name}
                        />
                    </div>
                    <div className={b('field-wrap')}>
                        <EditText
                            id='customer-phone'
                            value={this.props.cartPageModel!.customerData.phone}
                            onChange={this.editTextChangeHandler}
                            placeholder='Ваш телефон'
                            label='Ваш телефон'
                            errorMessage={this.props.cartPageModel!.customerError.phone}
                        />
                    </div>
                    <div className={b('field-wrap')}>
                        <Button
                            text='Оставить заказ'
                            onClick={this.onSendRequestHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderCartItems(isMobile = false): React.ReactNode {
        return (
            <div className={b('wrapper')}>
                <div className={`${b('cart-items-container')} ${isMobile ? 'mobile' : ''}`}>
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
        );
    }

    private renderEmptyCart(): React.ReactNode {
        return (
            <div className={b('empty-cart')}>
                <div className={b('empty-cart-wrapper')}>
                    <h1>Ваша корзина пуста.</h1>
                    <Button
                        text={'Начать покупки'}
                        onClick={() => {
                            this.props.history.push('/');
                        }}
                    />
                </div>
            </div>
        );
    }

    private renderPopupContent(): React.ReactNode {
        if (this.props.cartPageModel!.showAddOrderSuccessPopup) {
            return (
                <div className={b('popup-success')}>
                    <h1 className='bold'>Спасибо :)</h1>
                    <h1>Ваш заказ успешно отправлен.</h1>
                    <h1>Скоро мы вам перезвоним.</h1>
                </div>
            );
        }

        if (this.props.cartPageModel!.showAddOrderErrorPopup) {
            return (
                <div className={b('popup-error')}>
                    <h1 className='bold'>Ooops :(</h1>
                    <h1>Попробуйте еще раз.</h1>
                </div>
            );
        }

        return (<div/>);
    }

    private onClosePopup = () => {
        if (this.props.cartPageModel!.showAddOrderSuccessPopup) {
            this.props.history.push('/');
        }

        this.props.cartPageModel!.showAddOrderSuccessPopup = false;
        this.props.cartPageModel!.showAddOrderErrorPopup = false;
    }

    private editTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const {id, value} = event.target;
        if (id === 'customer-name') {
            this.props.cartPageModel!.customerError.name = '';
            this.props.cartPageModel!.setCustomerName(value);
        } else if (id === 'customer-phone') {
            this.props.cartPageModel!.customerError.phone = '';
            this.props.cartPageModel!.setCustomerPhone(value);
        }
    }

    private onSendRequestHandler = (): void => {
        if (this.props.cartPageModel!.validateCustomerData()) {
            this.props.cartPageModel!.transparentProgressLock = true;
            this.props.cartPageModel!.addOrder().then(() => {
                this.props.cartPageModel!.showAddOrderSuccessPopup = true;
                this.props.cartPageModel!.resetCustomerData();
                this.props.cartPageModel!.resetCookie();
            }).catch(() => {
                this.props.cartPageModel!.showAddOrderErrorPopup = true;
            }).finally(() => {
                this.props.cartPageModel!.transparentProgressLock = false;
            });
        }
    }

    private onDeleteIphoneHandler = (iphone: IIphone): void => {
        this.props.cartPageModel!.removeIphone(iphone);
    }

    private onDeleteAirpodHandler = (airpod: IAirpod): void => {
        this.props.cartPageModel!.removeAirpod(airpod);
    }
}
