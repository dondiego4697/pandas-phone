import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('edit-text');

interface IProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    type?: string;
}

export class EditText extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <div className={`${b('input')} ${this.props.errorMessage ? b('input-error') : ''}`}>
                            <input
                                type={this.props.type || 'text'}
                                value={this.props.value}
                                id={this.props.id}
                                onChange={this.props.onChange}
                                className={b('input-text')}
                                placeholder={this.props.placeholder}
                            />
                            <label
                                htmlFor={this.props.id}
                                className={b('input-label')}
                            >
                                {this.props.label}
                            </label>
                            <label
                                htmlFor={this.props.id}
                                className={`${b('input-label')} ${b('input-label-error')}`}
                            >
                                {this.props.errorMessage}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
