import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {CartPageModel} from 'client/models/cart';
import {ClientDataModel} from 'client/models/client-data';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';

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

    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.cartPageModel!.status === PageStatus.LOADING}
                />
            </div>
        );
    }
}
