import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';
import {Text} from '@denstep-core/components/text';

import './index.scss';

const b = bevis('not-found-page');

export class NotFoundPage extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <img src={'/public/imgs/bender-root/404.png'}/>
                    <Text
                        text='Not found'
                        colorPreset='dark'
                        typePreset='header'
                        textAlign='center'
                    />
                </div>
            </div>
        );
    }
}
