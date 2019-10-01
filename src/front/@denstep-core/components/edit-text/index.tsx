import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';
import {formatNumber} from '@denstep-core/libs/formatter';

import './index.scss';

const b = bevis('edit-text');

interface INumberOptions {
    type: 'number';
    maxValue?: number;
    minValue?: number;
}

interface IProps {
    id: string;
    placeholder: string;
    value: any;
    onChange: (value: string) => void;
    options?: INumberOptions;
}

interface IState {
    errorMessage: string | null;
}

export class EditText extends React.Component<IProps, IState> {
    state = {errorMessage: null};

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <div className={classnames(b('input'), {
                            [b('input-error')]: this.state.errorMessage
                        })}>
                            <input
                                type='text'
                                value={this.props.value}
                                id={this.props.id}
                                onChange={this.onChange}
                                className={b('input-text')}
                                placeholder={this.props.placeholder}
                            />
                            <label
                                htmlFor={this.props.id}
                                className={b('input-label')}
                            >
                                {this.props.placeholder}
                            </label>
                            <label
                                htmlFor={this.props.id}
                                className={classnames(b('input-label'), b('input-label-error'))}
                            >
                                {this.state.errorMessage}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private format(value: string): string {
        if (!this.props.options) {
            return value;
        }

        if (this.props.options.type === 'number') {
            return formatNumber(value, {
                min: this.props.options.minValue,
                max: this.props.options.maxValue
            });
        }

        return value;
    }

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(this.format(event.target.value));
    }
}
