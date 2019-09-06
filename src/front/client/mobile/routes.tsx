import * as React from 'react';
import {Switch} from 'react-router-dom';
import {inject} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import App from 'client/mobile/pages/app';

interface Props {
    clientDataModel?: ClientDataModel;
}

@inject('clientDataModel')
export default class Router extends React.Component<Props> {
    private _renderRouter(): React.ReactNode {
        return (
            <Switch>
                {/* <Route exact path='/' component={<div/>} />
                <Route component={NotFound} /> */}
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
