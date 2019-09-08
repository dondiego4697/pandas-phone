import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {ClientDataModel} from 'admin/models/client-data';
import {AdminPanelPageModel} from 'admin/models/admin-panel';
import ProgressBar from 'admin/components/progress-bar';
import bevis from 'libs/bevis';
import {PageStatus} from 'admin/libs/types';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    adminPanelPageModel?: AdminPanelPageModel;
}

const b = bevis('admin-panel');

@inject('clientDataModel', 'adminPanelPageModel')
@observer
export default class AdminPanelPage extends React.Component<Props> {
    componentDidMount() {
        this.props.adminPanelPageModel!.fetchTables();
    }

    render(): React.ReactNode {
        if (this.props.adminPanelPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />
        }

        return (<div className={b()}>
            <div className={b('container')}>
                {this.props.adminPanelPageModel!.tables.map((table, i) =>
                    <li key={`li-${table}-${i}`}>
                        <h1 key={`h1-${table}-${i}`}>
                            <Link
                                key={`link-${table}-${i}`}
                                to={`/admin-panel/${table.replace(/\_/gmi, '-')}`}
                            >
                                {table}
                            </Link>
                        </h1>
                    </li>
                )}
            </div>
        </div>);
    }
}
