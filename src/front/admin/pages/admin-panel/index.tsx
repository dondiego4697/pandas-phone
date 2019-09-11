import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {AdminPanelPageModel} from 'admin/models/admin-panel';
import {Bender} from 'admin/components/bender';
import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
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
                    {this.props.adminPanelPageModel!.pages.map((page, i) =>
                        <li key={`li-${page}-${i}`}>
                            <h1 key={`h1-${page}-${i}`}>
                                <Link
                                    key={`link-${page}-${i}`}
                                    to={`/bender-root/${page}`}
                                >
                                    {page}
                                </Link>
                            </h1>
                        </li>
                    )}
                </div>
            </div>
        );
    }
}
