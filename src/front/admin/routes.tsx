import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {inject} from 'mobx-react';

import App from 'admin/pages/app';
import {ForbiddenPage} from 'admin/pages/forbidden';
import {NotFoundPage} from 'admin/pages/not-found';
import {GoodItemsPage} from 'admin/pages/good-items';
import {GoodItemPage} from 'admin/pages/good-item';
import {OrdersPage} from 'admin/pages/orders';
import {OrderPage} from 'admin/pages/order';
import {OrderItemPage} from 'admin/pages/order-item';

import {ClientDataModel} from 'admin/models/client-data';

interface IProps {
    clientDataModel?: ClientDataModel;
}

@inject('clientDataModel')
export class RoutesApp extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <App>
                {this.renderRouter()}
            </App>
        );
    }

    private renderRouter(): React.ReactNode {
        if (this.props.clientDataModel!.forbidden) {
            return <ForbiddenPage />;
        }

        return (
            <Switch>
                <Route exact path='/bender-root' component={GoodItemsPage} />
                <Route exact path='/bender-root/good-item/:goodItemId' component={GoodItemPage} />
                <Route exact path='/bender-root/orders' component={OrdersPage} />
                <Route exact path='/bender-root/order/:orderId' component={OrderPage} />
                <Route exact path='/bender-root/order/:orderId/item/:orderItemId' component={OrderItemPage} />
                <Route component={NotFoundPage} />
            </Switch>
        );
    }
}
