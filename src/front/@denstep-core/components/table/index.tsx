import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';
import {ImageButton} from '@denstep-core/components/image-button';

import './index.scss';

const b = bevis('table');

export interface ITableSchema extends ISchema {};

interface ISchema {
    title: string;
    key: string;
    type?: 'boolean' | 'array';
}

interface IEditable {
    onAdd?: () => void;
    onEdit?: (data: any) => void;
    onDelete?: (data: any) => void;
}

interface IProps {
    header: string;
    schema: ISchema[];
    items: Record<string, any>[];
    editable: IEditable;
}

export class Table extends React.Component<IProps> {
    public render(): React.ReactNode {
        const titles = this.props.schema.map(({title}) => title);
        const rows = this.props.items.map((item) => {
            return this.props.schema.map(({key}) => {
                return item[key];
            });
        });

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <header>
                        <h3>{this.props.header}</h3>
                        <div className='add-item-button'>
                            {this.props.editable.onAdd && <ImageButton
                                src='/public/imgs/components/table/add.svg'
                                onClick={this.onAddClickHandler}
                            />}
                        </div>
                    </header>
                    <div className={b('table-content')}>
                        <table>
                            <thead>
                                <tr>
                                    {this.renderHeader(titles)}
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderRows(rows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    private renderHeader(titles: string[]) {
        return titles.map((title, i) => (
            <th
                key={`table-header-${i}`}
                className={b('header-item')}
            >
                <span>
                    {title}
                </span>
            </th>
        ));
    }

    private renderRowItem(item: any, index: number): React.ReactNode {
        if (item === null || item === undefined) {
            return '-';
        }

        const type = this.props.schema[index].type;

        if (type === 'boolean') {
            return <img
                className={b('boolean-row-item')}
                src={`/public/imgs/components/table/${item}.svg`}
            />;
        }

        if (type === 'array') {
            return (
                <div className={b('array-row-item')}>
                    {(item as any[]).map((el, i) => (
                        <span key={`array-row-item-${index}-${i}`}>{el}</span>
                    ))}
                </div>
            );
        }

        return String(item);
    }

    private renderRows(rows: any[][]) {
        return rows.map((row, i) => (
            <tr
                key={`table-row-${i}`}
                className={b('row')}
            >
                {row.map((item, j) => (
                    <td
                        key={`table-row-item-${j}`}
                        className={b('row-item')}
                    >
                        <div>
                            {this.renderRowItem(item, j)}
                        </div>
                    </td>
                ))}
                <td className={b('row-item')}>
                    <div className={b('row-controls-container')}>
                        {this.props.editable.onEdit && <ImageButton
                            src='/public/imgs/components/table/edit.svg'
                            onClick={() => this.onEditClickHandler(this.props.items[i])}
                        />}
                        {this.props.editable.onDelete && <ImageButton
                            src='/public/imgs/components/table/delete.svg'
                            onClick={() => this.onDeleteClickHandler(this.props.items[i])}
                        />}
                    </div>
                </td>
            </tr>
        ));
    }

    private onAddClickHandler = () => {
        this.props.editable.onAdd && this.props.editable.onAdd();
    }

    private onEditClickHandler = (data: any) => {
        this.props.editable.onEdit && this.props.editable.onEdit(data);
    }

    private onDeleteClickHandler = (row: any) => {
        this.props.editable.onDelete && this.props.editable.onDelete(row);
    }
}
