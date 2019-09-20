import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {inject} from 'mobx-react';

import App from 'admin/pages/app';
import {AdminPanelPage} from 'admin/pages/admin-panel';
import {AirpodsPage} from 'admin/pages/airpods';
import {ForbiddenPage} from 'admin/pages/forbidden';
import {IphonesPage} from 'admin/pages/iphones';
import {NotFoundPage} from 'admin/pages/not-found';
import {OrderPage} from 'admin/pages/order';
import {OrdersPage} from 'admin/pages/orders';

import {ClientDataModel} from 'admin/models/client-data';

interface IProps {
    clientDataModel?: ClientDataModel;
}

@inject('clientDataModel')
export default class Router extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <App>
                {this.renderRouter()}
            </App>
        );
    }

    private renderRouter(): React.ReactNode {
        const {forbidden} = this.props.clientDataModel!;

        if (forbidden) {
            // TODO return <ForbiddenPage />;
        }

        return (
            <Switch>
                <Route exact path='/bender-root' component={AdminPanelPage} />
                <Route exact path='/bender-root/iphones' component={IphonesPage} />
                <Route exact path='/bender-root/airpods' component={AirpodsPage} />
                <Route exact path='/bender-root/orders' component={OrdersPage} />
                <Route exact path='/bender-root/order/:orderId' component={OrderPage} />;
                <Route component={NotFoundPage} />
            </Switch>
        );
    }
}
