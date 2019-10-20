import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {ClientDataModel} from 'client/models/client-data';
import {Popup} from '@denstep-core/components/popup';
import {Navbar} from 'client/components/navbar';
import {CookieInfo} from 'client/components/cookie-info';

import './index.scss';

interface IProps extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
}

const b = bevis('app');

@inject('clientDataModel')
@observer
class App extends React.Component<IProps, {}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {this.renderCookiePanel()}
                {this.renderPopup()}
                {this.renderNavbar()}
                <div className={b('container')}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    private renderCookiePanel(): React.ReactNode {
        if (this.props.clientDataModel!.cookieAccepted) {
            return;
        }

        return (
            <CookieInfo
                onClickAccept={() => this.props.clientDataModel!.setCookieAccepted()}
            />
        );
    }

    private renderPopup(): React.ReactNode {
        if (this.props.clientDataModel!) {
            return;
        }

        return (
            <Popup
                show={this.props.clientDataModel!.global.popupContent !== null}
                onClose={() => this.props.clientDataModel!.setPopupContent(null)}
            >
                {this.props.clientDataModel!.global.popupContent}
            </Popup>
        );
    }

    private renderNavbar(): React.ReactNode {
        return (
            <Navbar
                cartItemsCount={this.props.clientDataModel!.cartItemsCount}
                onCartClick={() => this.props.history.push('/cart')}
            />
        );
    }
}

export default withRouter(App);
