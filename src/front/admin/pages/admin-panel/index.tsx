import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import {AdminPanelPageModel} from 'admin/models/admin-panel';
import {Bender} from 'admin/components/bender';
import bevis from '@denstep-core/libs/bevis';
import {Button} from '@denstep-core/components/button';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    adminPanelPageModel?: AdminPanelPageModel;
}

const b = bevis('admin-panel');

@inject('adminPanelPageModel')
@observer
export class AdminPanelPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    <div className={b('items-container')}>
                        {this.props.adminPanelPageModel!.pages.map((page, i) =>
                            <Button
                                key={`key-${page.path}-${i}`}
                                text={page.title}
                                typePreset='button'
                                colorPreset='dark'
                                onClick={() => this.props.history.push(page.path)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
