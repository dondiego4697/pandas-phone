import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {MainPageModel} from 'client/models/main';
import {BrowserHeader} from 'client/components/browser/header';
import {BrowserFace} from 'client/components/browser/face';
import {ClientDataModel} from 'client/models/client-data';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    mainPageModel?: MainPageModel;
    clientDataModel?: ClientDataModel;
}

const b = bevis('main');

@inject('mainPageModel', 'clientDataModel')
@observer
export class MainPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {/* TODO плашка о куках */}
                {!this.props.clientDataModel!.isMobile && this.renderBrowser()}
                {this.props.clientDataModel!.isMobile && this.renderMobile()}
            </div>
        );
    }

    private renderBrowser(): React.ReactNode {
        return (
            <div className={b('container')}>
                <BrowserHeader/>
                <BrowserFace socialLinks={this.props.clientDataModel!.socialLinks}/>
            </div>
        );
    }

    private renderMobile() {

    }
}
