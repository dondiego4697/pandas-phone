import * as React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import App from 'admin/components/app';
import reducers from 'admin/reducers';

const store = createStore(reducers);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
