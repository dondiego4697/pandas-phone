import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {Popup} from '@denstep-core/components/popup';
import {Navbar} from '@denstep-core/components/navbar';
import {ClientDataModel} from 'admin/models/client-data';
import {textDictionary} from 'common/text-dictionary';

import './index.scss';

interface IProps extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
}

const b = bevis('admin-page');

@inject('clientDataModel')
@observer
class App extends React.Component<IProps, {}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {this.renderPopup()}
                {this.renderNavbar()}
                <div className={b('container')}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    private renderNavbar(): React.ReactNode {
        if (this.props.clientDataModel!.forbidden) {
            return;
        }

        return (
            <Navbar
                pages={[
                    {
                        path: '/bender-root',
                        title: textDictionary['table.goodItems.header']
                    },
                    {
                        path: '/bender-root/orders',
                        title: textDictionary['table.orders.header']
                    }
                ]}
                current={this.props.location.pathname}
                logo={{
                    path: '/bender-root',
                    src: '/public/imgs/bender-root/bender.png'
                }}
            />
        );
    }

    private renderPopup(): React.ReactNode {
        if (this.props.clientDataModel!.forbidden) {
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
}

export default withRouter(App);
