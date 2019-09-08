import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {inject} from 'mobx-react';

import App from 'admin/pages/app';
import AdminPanel from 'admin/pages/admin-panel';
import GoodBrand from 'admin/pages/good-brand';
import NotFound from 'admin/pages/not-found';
import Forbidden from 'admin/pages/forbidden';
import {ClientDataModel} from 'admin/models/client-data';

interface Props {
    clientDataModel?: ClientDataModel;
}

@inject('clientDataModel')
export default class Router extends React.Component<Props> {
    private _renderRouter(): React.ReactNode {
        const {forbidden} = this.props.clientDataModel!;

        if (forbidden) {
            return <Forbidden />;
        }

        return (
            <Switch>
                <Route exact path='/admin-panel' component={AdminPanel} />
                <Route exact path='/admin-panel/good-brand' component={GoodBrand} />
                <Route component={NotFound} />
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
