import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {ClientDataModel} from 'admin/models/client-data';
import Navigation from 'admin/components/navigation';

interface Props {
    clientDataModel?: ClientDataModel;
}

import './index.scss';

@inject('clientDataModel')
@observer
export default class ShopPage extends React.Component<Props> {
    handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        this.props.clientDataModel!.setTabItem(newValue);
    }

    render(): React.ReactNode {
        return (
            <Navigation
                tabItem={this.props.clientDataModel!.tabItem}
                tabs={this.props.clientDataModel!.tableTabs.map((tab) => {
                    return {...tab, children: tab.label};
                })}
                handleTabChange={this.handleTabChange}
            />
        );
    }
}
