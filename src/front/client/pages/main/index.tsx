import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import {MainPageModel, IIphone, IAirpod} from 'client/models/main';
import {Header} from 'client/components/header';
import {FacePanel} from 'client/components/face';
import {ClientDataModel} from 'client/models/client-data';
import {IphoneCard} from 'client/components/card-item/iphone';
import {Footer} from 'client/components/footer';
import {Popup} from 'client/components/popup';
import {ProgressLock} from 'client/components/progress-lock';
import {ClientCookie} from 'client/libs/cookie';
import {PageStatus} from 'libs/types';
import {AirpodCard} from 'client/components/card-item/airpod';
import {Button} from 'client/components/button';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    mainPageModel?: MainPageModel;
}

const b = bevis('main');

@inject('mainPageModel', 'clientDataModel')
@observer
export class MainPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.mainPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {!this.props.clientDataModel!.isMobile && this.renderBrowser()}
                {this.props.clientDataModel!.isMobile && this.renderMobile()}
            </div>
        );
    }

    private onAddAirpodToCartHandler = (airpod: IAirpod): void => {
        this.props.mainPageModel!.showAddedToCartPopup = true;
        ClientCookie.addIdInCart('airpod', airpod.id);
        this.props.mainPageModel!.calcCart();
    }

    private onAddIphoneToCartHandler = (iphone: IIphone): void => {
        this.props.mainPageModel!.showAddedToCartPopup = true;
        ClientCookie.addIdInCart('iphone', iphone.id);
        this.props.mainPageModel!.calcCart();
    }

    private onClosePopup = (): void => {
        this.props.mainPageModel!.showAddedToCartPopup = false;
    }

    private renderPopupContent(): React.ReactNode {
        return (
            <div>
                <h1 className={b('popup-title')}>Добавлено в корзину</h1>
                <div className={b('popup-controls-container')}>
                    <div className={b('popup-button-container')}>
                        <Button
                            text='Продолжить покупки'
                            onClick={this.onClosePopup}
                        />
                    </div>
                    <div
                        className={b('popup-button-container')}
                        onClick={this.onClosePopup}
                        style={{marginLeft: 16}}
                    >
                        <Button
                            text='Перейти в корзину'
                            type='light'
                            onClick={() => this.props.history.push('/cart')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderBrowser(): React.ReactNode {
        return (
            <div className={b('container')}>
                <ProgressLock show={this.props.mainPageModel!.status === PageStatus.LOADING}/>
                <Popup
                    show={this.props.mainPageModel!.showAddedToCartPopup}
                    onClose={this.onClosePopup}
                >
                    {this.renderPopupContent()}
                </Popup>
                <Header budgeCount={this.props.mainPageModel!.cartCount}/>
                <FacePanel socialLinks={this.props.clientDataModel!.socialLinks}/>
                <h1 className={b('sub-header')}>iPhones</h1>
                <div className={b('items-container')}>
                    <div className={b('items-wrapper')}>
                        {
                            this.props.mainPageModel!.barItems &&
                            this.props.mainPageModel!.barItems.iphones.map((iphone, i) => {
                                return <IphoneCard
                                    key={`key-iphone-card-${i}`}
                                    iphone={iphone}
                                    buttonText='Добавить в корзину'
                                    onClick={this.onAddIphoneToCartHandler}
                                />;
                            })
                        }
                    </div>
                </div>
                <h1 className={b('sub-header')}>AirPods</h1>
                <div className={b('items-container')}>
                    <div className={b('items-wrapper')}>
                        {
                            this.props.mainPageModel!.barItems &&
                            this.props.mainPageModel!.barItems.airpods.map((airpod, i) => {
                                return <AirpodCard
                                    key={`key-airpod-card-${i}`}
                                    airpod={airpod}
                                    buttonText='Добавить в корзину'
                                    onClick={this.onAddAirpodToCartHandler}
                                />;
                            })
                        }
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

    private renderMobile(): React.ReactNode {
        return <div/>;
    }
}
