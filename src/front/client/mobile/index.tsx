import * as React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {App} from 'client/mobile/components/app';
import reducer from 'client/reducer';

const store = createStore(reducer);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
