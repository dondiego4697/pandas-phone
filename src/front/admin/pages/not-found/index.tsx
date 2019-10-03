import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';
import {Text} from '@denstep-core/components/text';
import {Bender} from 'admin/components/bender';

import './index.scss';

const b = bevis('not-found');

export class NotFoundPage extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    <Text
                        text='Not found'
                        colorPreset='dark'
                        typePreset='header'
                    />
                </div>
            </div>
        );
    }
}
