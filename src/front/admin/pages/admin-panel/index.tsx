import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {ClientDataModel} from 'admin/models/client-data';
import {AdminPanelPageModel} from 'admin/models/admin-panel';
import {Bender} from 'admin/components/bender';
import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    clientDataModel?: ClientDataModel;
    adminPanelPageModel?: AdminPanelPageModel;
}

const b = bevis('admin-panel');

@inject('clientDataModel', 'adminPanelPageModel')
@observer
export class AdminPanelPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    {this.props.adminPanelPageModel!.tables.map((table, i) =>
                        <li key={`li-${table}-${i}`}>
                            <h1 key={`h1-${table}-${i}`}>
                                <Link
                                    key={`link-${table}-${i}`}
                                    to={`/bender-root/${table.replace(/\_/gmi, '-')}`}
                                >
                                    {table}
                                </Link>
                            </h1>
                        </li>
                    )}
                </div>
            </div>
        );
    }
}
