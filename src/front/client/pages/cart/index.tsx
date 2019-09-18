import * as React from 'react';
import {inject, observer} from 'mobx-react';

import bevis from 'libs/bevis';
import {CartPageModel} from 'client/models/cart';
import {ClientDataModel} from 'client/models/client-data';
import {PageStatus} from 'libs/types';
import {ProgressLock} from 'client/components/progress-lock';
import {Header} from 'client/components/header';

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
                    <Header/>
                    <div className={b('cart-items-container')}>

                    </div>
                </div>
            </div>
        );
    }
}
