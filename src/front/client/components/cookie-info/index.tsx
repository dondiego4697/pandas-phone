import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';
import {Button} from '@denstep-core/components/button';
import {Text} from '@denstep-core/components/text';

import './index.scss';

const b = bevis('cookie-info');

interface IProps {
    onClickAccept: () => void;
}

export class CookieInfo extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('img-container')}>
                        <img src='/public/imgs/client/cookie.jpg' />
                    </div>
                    <div className={b('text-container')}>
                        <Text
                            colorPreset='dark'
                            typePreset='text'
                            text={`
                                Этот сайт использует куки-файлы и другие технологии, чтобы помочь вам в навигации,
                                а также предоставить лучший пользовательский опыт,
                                анализировать использование наших продуктов и услуг,
                                повысить качество рекламных и маркетинговых активностей.
                            `}
                        />
                    </div>
                    <div className={b('button-container')}>
                        <Button
                            typePreset='button'
                            colorPreset='dark'
                            text='Принять'
                            onClick={this.props.onClickAccept}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
