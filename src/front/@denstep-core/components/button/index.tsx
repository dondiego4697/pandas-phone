import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';
import {buttonArrowSvg} from '@denstep-core/components/svg';

import './index.scss';

const b = bevis('button');

type TypePreset = 'simple' | 'button' | 'link';
type ColorPreset = 'dark' | 'light';

interface IProps {
    text: string;
    typePreset: TypePreset;
    colorPreset: ColorPreset;
    onClick: () => void;
}

export class Button extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()} onClick={this.props.onClick}>
                <div className={b('container')}>
                    {this.renderButton()}
                </div>
            </div>
        );
    }

    private renderButton(): React.ReactNode {
        const {typePreset, colorPreset, text} = this.props;
        const classNamesOptions = {
            [b(typePreset)]: true,
            [colorPreset]: true
        };

        if (typePreset === 'button') {
            return (
                <button className={classnames(classNamesOptions)}>
                    {text}
                </button>
            );
        } else if (typePreset === 'link') {
            return (
                <div className={classnames(classNamesOptions)}>
                    {text}
                    {buttonArrowSvg}
                </div>
            );
        } else if (typePreset === 'simple') {
            return (
                <div className={classnames(classNamesOptions)}>
                    {text}
                </div>
            );
        }
    }
}
