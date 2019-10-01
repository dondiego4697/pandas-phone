import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('check-box');

interface IProps {
    items: string[];
    selected: string[];
    label?: string;
    onChange: (selected: string[]) => void;
}

export class CheckBox extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    {this.props.label && <p>{this.props.label}</p>}
                    <ul className={b('list')}>
                        {
                            this.props.items.map((item, i) => (
                                <li
                                    key={`key-checkbox-item-${i}`}
                                    className={b('item')}
                                >
                                    <input
                                        type='checkbox'
                                        id={`checkbox-${i}`}
                                        value={item}
                                        checked={this.props.selected.includes(item)}
                                        onChange={this.onChange}
                                    />
                                    <label
                                        htmlFor={`checkbox-${i}`}
                                        className={b('item-label')}
                                    >
                                        {item}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            this.props.onChange(this.props.selected.concat(event.target.value));
        } else {
            const index = this.props.selected.indexOf(event.target.value);
            this.props.selected.splice(index, 1);
            this.props.onChange(this.props.selected);
        }
    }
}
