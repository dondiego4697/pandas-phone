import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from 'libs/bevis';
import {ClientDataModel} from 'admin/models/client-data';

import './index.scss'

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
}

const b = bevis('admin');

@inject('clientDataModel')
@observer
class App extends React.Component<Props, {}> {
    render() {
        return (
            <div className={b()}>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(App);
