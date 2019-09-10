import * as React from 'react';
import {Switch} from 'react-router-dom';
import {inject} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import {App} from 'client/browser/pages/app';

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
            <Switch/>
        );
    }
}
