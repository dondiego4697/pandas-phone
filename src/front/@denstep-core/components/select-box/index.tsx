import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';
import {angleDownSvg} from '@denstep-core/components/svg';

import './index.scss';

const b = bevis('select-box');

export interface ISelectBoxItem {
    key: string;
    value: string;
}

interface IProps {
    items: ISelectBoxItem[];
    selected?: string | null;
    onChange: (key: string) => void;
    placeholder?: string;
}

interface IState {
    opened: boolean;
}

export class SelectBox extends React.Component<IProps, IState> {
    public state = {opened: false}

    public componentDidMount() {}

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')} >
                    <label className={b('placeholder')}>{this.props.placeholder || ''}</label>
                    <div
                        tabIndex={1}
                        onBlur={this.onBlurHandler}
                        onClick={this.onClickHandler}
                        className={classnames(b('wrapper'), {
                            'opened': this.state.opened
                        })}
                    >
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
                        {angleDownSvg}
                    </div>
                    <ul className={b('list')}>
                        {this.props.items.map((item, i) => {
                            return (
                                <li key={`select-box-li-${i}`}>
                                    <label
                                        htmlFor={item.key}
                                        onMouseDown={this.onItemClickHandler}
                                        className={classnames(b('option'), {
                                            [b('option-selected')]: this.props.selected === item.key
                                        })}
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

    private onBlurHandler = () => {
        this.setState({opened: false});
    }

    private onClickHandler = () => {
        this.setState({opened: !this.state.opened});
    }

    private onItemClickHandler = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        const key = (event.target as HTMLElement).getAttribute('for');
        this.props.onChange(key!);
    }
}
