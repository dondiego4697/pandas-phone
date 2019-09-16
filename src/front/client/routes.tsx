import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {inject} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import App from 'client/pages/app';
import {MainPage} from 'client/pages/main';
import {NotFoundPage} from 'client/pages/not-fount';

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
        return (
            <Switch>
                <Route exact path='/' component={MainPage} />
                <Route component={NotFoundPage} />
            </Switch>
        );
    }
}
