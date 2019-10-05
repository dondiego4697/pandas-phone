import * as React from 'react';
import {PhoneNumberFormat as PNF, PhoneNumberUtil} from 'google-libphonenumber';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';
import {formatNumber} from '@denstep-core/libs/formatter';

import './index.scss';

const b = bevis('edit-text');
const phoneUtil = PhoneNumberUtil.getInstance();

interface INumberOptions {
    type: 'number';
    maxValue?: number;
    minValue?: number;
}

interface IPhoneNumberOptions {
    type: 'phonenumber';
}

type Options = INumberOptions | IPhoneNumberOptions;

interface IProps {
    id: string;
    placeholder: string;
    value: any;
    onChange: (value: string) => void;
    options?: Options;
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

    private format(rawValue: string): string {
        if (!this.props.options) {
            return rawValue;
        }

        if (this.props.options.type === 'number') {
            return formatNumber(rawValue, {
                min: this.props.options.minValue,
                max: this.props.options.maxValue
            });
        }

        if (this.props.options.type === 'phonenumber') {
            let value = rawValue.replace(/[^\+0-9]/gim, '');
            if (value.length <= 1 && value !== '+') {
                return `+${value}`;
            }

            try {
                const number = phoneUtil.parse(value, 'RU');
                value = phoneUtil.format(number, PNF.INTERNATIONAL);
                // tslint:disable-next-line
            } catch (_) {} finally {
                return value;
            }
        }

        return rawValue;
    }

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(this.format(event.target.value));
    }
}
