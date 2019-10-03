import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('text');

type TypePreset = 'header' | 'text';
type ColorPreset = 'dark' | 'light';

interface IProps {
    text: string;
    typePreset: TypePreset;
    colorPreset: ColorPreset;
    textAlign?: 'center';
}

export class Text extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    {this.renderText()}
                </div>
            </div>
        );
    }

    private renderText(): React.ReactNode {
        const {typePreset, colorPreset, text, textAlign} = this.props;
        const classNamesOptions = {
            [b(typePreset)]: true,
            [b('align-center')]: textAlign && textAlign === 'center',
            [colorPreset]: true
        };

        if (typePreset === 'header') {
            return (
                <h2 className={classnames(classNamesOptions)}>
                    {text}
                </h2>
            );
        } else if (typePreset === 'text') {
            return (
                <p className={classnames(classNamesOptions)}>
                    {text}
                </p>
            );
        }
    }
}
