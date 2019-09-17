import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {MainPageModel} from 'client/models/main';
import {Header} from 'client/components/header';
import {FacePanel} from 'client/components/face';
import {ClientDataModel} from 'client/models/client-data';
import {ItemCard} from 'client/components/item-card';
import {Footer} from 'client/components/footer';
import {ItemCardDescription, IItemCardDescriptionField} from 'client/components/item-card-description';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    mainPageModel?: MainPageModel;
    clientDataModel?: ClientDataModel;
}

const b = bevis('main');

function iPhoneColorMapper(color: string): string | undefined {
    const mapper: Record<string, string> = {
        silver: 'Серебряный',
        gold: 'Золотой',
        white: 'Белый',
        yellow: 'Желтый',
        coral: 'Коралловый',
        blue: 'Синий',
        black: 'Черный',
        'rose gold': 'Розовое золото',
        'space gray': 'Space gray',
        'product-red': 'PRODUCT(RED)',
        'black matte': 'Черный матовый',
        'black jet': 'Черный оникс'
    };

    return mapper[color];
}

function airpodOriginalMapper(original: boolean): string {
    if (original) {
        return 'Оригинал';
    }

    return 'Копия';
}

function airpodChargingMapper(charging: boolean): string {
    if (charging) {
        return 'Кейс заряжает';
    }

    return 'Кейс не заряжает';
}

function getPrice(price: number, discount: number): string {
    return (price * (1 - discount / 100)).toFixed(2);
}

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

    private onAddToCart(id: string): void {
        const [type, dataRaw] = id.split('$');
        const data = JSON.parse(dataRaw);

        // TODO show alert что добавилось в корзину
    }

    private renderBrowser(): React.ReactNode {
        return (
            <div className={b('container')}>
                <Header/>
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
                                    callbackData={`iphone$${JSON.stringify(iphone)}`}
                                    onAddToCart={this.onAddToCart}
                                    title={`iPhone ${model}`}
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
                                    callbackData={`airpods$${JSON.stringify(airpod)}`}
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
