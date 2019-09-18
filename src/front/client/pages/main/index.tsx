import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {MainPageModel} from 'client/models/main';
import {Header} from 'client/components/header';
import {FacePanel} from 'client/components/face';
import {ClientDataModel} from 'client/models/client-data';
import {ItemCard} from 'client/components/item-card';
import {Footer} from 'client/components/footer';
import {ItemCardDescription, IItemCardDescriptionField} from 'client/components/item-card-description';
import {AddedToCartPopup} from 'client/components/added-to-cart-popup';
import {ProgressLock} from 'client/components/progress-lock';
import {ClientCookie} from 'client/libs/cookie';
import {PageStatus} from 'libs/types';
import {
    iPhoneColorMapper,
    airpodChargingMapper,
    airpodOriginalMapper,
    getPrice,
    iPhoneModelrMapper
} from 'client/libs/text-mapper';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    mainPageModel?: MainPageModel;
    clientDataModel?: ClientDataModel;
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
                {/* TODO плашка о куках */}
                {!this.props.clientDataModel!.isMobile && this.renderBrowser()}
                {this.props.clientDataModel!.isMobile && this.renderMobile()}
            </div>
        );
    }

    private onAddToCart = (callbackData: any): void => {
        this.props.mainPageModel!.showAddedToCartPopup = true;

        const {type, item} = callbackData;
        ClientCookie.addIdInCart(type === 'airpod' ? 'airpod' : 'iphone', item.id);
        this.props.mainPageModel!.calcCartCount();
    }

    private onCloseAddedToCartPopup = (): void => {
        this.props.mainPageModel!.showAddedToCartPopup = false;
    }

    private renderBrowser(): React.ReactNode {
        return (
            <div className={b('container')}>
                <ProgressLock show={this.props.mainPageModel!.status === PageStatus.LOADING}/>
                <AddedToCartPopup
                    show={this.props.mainPageModel!.showAddedToCartPopup}
                    onClose={this.onCloseAddedToCartPopup}
                />
                <Header budgeCount={this.props.mainPageModel!.cartCount}/>
                <FacePanel socialLinks={this.props.clientDataModel!.socialLinks}/>
                <h1 className={b('sub-header')}>iPhones</h1>
                <div className={b('items-container')}>
                    <div className={b('items-wrapper')}>
                        {
                            this.props.mainPageModel!.barItems &&
                            this.props.mainPageModel!.barItems.iphones.map((iphone, i) => {
                                const model = iphone.model;
                                const fields: IItemCardDescriptionField[] = [
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

                                return <ItemCard
                                    key={`key-${model}-${i}`}
                                    type='iphone'
                                    model={`${model} ${iphone.color}`}
                                    callbackData={{type: 'iphone', item: iphone}}
                                    onAddToCart={this.onAddToCart}
                                    title={`iPhone ${iPhoneModelrMapper(model)}`}
                                >
                                    <ItemCardDescription
                                        fields={fields}
                                    />
                                </ItemCard>;
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
                                const s = airpod.series;
                                const fields: IItemCardDescriptionField[] = [
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
                                return <ItemCard
                                    key={`key-${s}-${i}`}
                                    type='airpods'
                                    model={s}
                                    callbackData={{type: 'airpods', item: airpod}}
                                    onAddToCart={this.onAddToCart}
                                    title={`AirPods series ${s}`}
                                >
                                    <ItemCardDescription
                                        fields={fields}
                                    />
                                </ItemCard>;
                            })
                        }
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

    private renderMobile() {

    }
}
