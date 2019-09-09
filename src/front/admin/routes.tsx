import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {inject} from 'mobx-react';

import App from 'admin/pages/app';
import {AdminPanelPage} from 'admin/pages/admin-panel';
import {ShopItemPage} from 'admin/pages/shop-item';
import {GoodPatternPage} from 'admin/pages/good-pattern';
import {OrderPage} from 'admin/pages/order';
import {NotFoundPage} from 'admin/pages/not-found';
import {ForbiddenPage} from 'admin/pages/forbidden';

import {ClientDataModel} from 'admin/models/client-data';

interface Props {
    clientDataModel?: ClientDataModel;
}

@inject('clientDataModel')
export default class Router extends React.Component<Props> {
    private _renderRouter(): React.ReactNode {
        const {forbidden} = this.props.clientDataModel!;

        if (forbidden) {
            return <ForbiddenPage />;
        }

        return (
            <Switch>
                <Route exact path='/admin-panel' component={AdminPanelPage} />
                <Route exact path='/admin-panel/shop-item' component={ShopItemPage} />
                <Route exact path='/admin-panel/good-pattern' component={GoodPatternPage} />
                <Route exact path='/admin-panel/order' component={OrderPage} />
                <Route component={NotFoundPage} />
            </Switch>
        );
    }

    render(): React.ReactNode {
        return (
            <App>
                {this._renderRouter()}
            </App>
        );
    }
}
