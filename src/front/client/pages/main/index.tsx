import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {MainPageModel} from 'client/models/main';
import {BrowserHeader} from 'client/components/browser/header';
import {BrowserFace} from 'client/components/browser/face';
import {ClientDataModel} from 'client/models/client-data';
import {BrowserItemCard} from 'client/components/browser/item-card';
import {BrowserFooter} from 'client/components/browser/footer';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    mainPageModel?: MainPageModel;
    clientDataModel?: ClientDataModel;
}

const b = bevis('main');

function iPhoneColorMapper(color: string): string | undefined {
    const mapper: Record<string, string> = {
        silver: 'серебряный',
        gold: 'золотой',
        white: 'белый',
        yellow: 'желтый',
        coral: 'коралловый',
        blue: 'синий',
        black: 'черный',
        'rose gold': 'розовое золото',
        'space gray': 'space gray',
        'product-red': 'PRODUCT(RED)',
        'black matte': 'черный матовый',
        'black jet': 'черный оникс'
    };

    return mapper[color];
}

function airpodOriginalMapper(original: boolean): string {
    if (original) {
        return 'оригинал';
    }

    return 'копия';
}

function airpodChargingMapper(charging: boolean): string {
    if (charging) {
        return 'кейс с зарядкой';
    }

    return 'кейс не заряжает';
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
                <BrowserHeader/>
                <BrowserFace socialLinks={this.props.clientDataModel!.socialLinks}/>
                <h1 className={b('sub-header')}>iPhones</h1>
                <div className={b('items-container')}>
                    <div className={b('items-wrapper')}>
                        {
                            this.props.mainPageModel!.barItems &&
                            this.props.mainPageModel!.barItems.iphones.map((iphone, i) => {
                                const model = iphone.model;
                                return <BrowserItemCard
                                    key={`key-${model}-${i}`}
                                    type='iphone'
                                    model={model}
                                    id={`iphone$${JSON.stringify(iphone)}`}
                                    price={iphone.price}
                                    discount={iphone.discount}
                                    onAddToCart={this.onAddToCart}
                                    description={`${iphone.memory} GB, ${iPhoneColorMapper(iphone.color)}`}
                                    header={`iPhone ${model}`}
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
                                const s = airpod.series;
                                return <BrowserItemCard
                                    key={`key-${s}-${i}`}
                                    type='airpods'
                                    model={s}
                                    id={`airpods$${JSON.stringify(airpod)}`}
                                    price={airpod.price}
                                    discount={airpod.discount}
                                    description={
                                        `${airpodOriginalMapper(airpod.original)}, ` +
                                        `${airpodChargingMapper(airpod.charging)}`
                                    }
                                    onAddToCart={this.onAddToCart}
                                    header={`AirPods series ${s}`}
                                />;
                            })
                        }
                    </div>
                </div>
                <BrowserFooter/>
            </div>
        );
    }

    private renderMobile() {

    }
}
