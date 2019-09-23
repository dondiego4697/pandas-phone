import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('select-box');

interface Item {
    key: string;
    value: string;
}
interface IProps {
    items: Item[];
    selected: string;
    onChange: (key: string) => void;
}

export class SelectBox extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('wrapper')} tabIndex={1}>
                        {this.props.items.map((item, i) => {
                            return (
                                <div
                                    key={`select-box-input-${i}`}
                                    className={classnames(b('value'), {
                                        'visible': this.props.selected === item.key
                                    })}
                                >
                                    <input
                                        className={b('input')}
                                        type='radio'
                                    />
                                    <p className={b('input-text')}>{item.value}</p>
                                </div>
                            );
                        })}
                        <img
                            className={b('icon')}
                            src='http://cdn.onlinewebfonts.com/svg/img_295694.svg'
                            alt='Arrow Icon'
                            aria-hidden='true'
                        />
                    </div>
                    <ul className={b('list')}>
                        {this.props.items.map((item, i) => {
                            return (
                                <li key={`select-box-li-${i}`}>
                                    <label
                                        htmlFor={item.key}
                                        onClick={this.onClickHandler}
                                        className={b('option')}
                                    >
                                        {item.value}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    private onClickHandler = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        const key = (event.target as HTMLElement).getAttribute('for');
        this.props.onChange(key!);
    }
}
