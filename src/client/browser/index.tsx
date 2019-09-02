import * as React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import App from 'client/browser/components/app'
import reducers from 'client/reducers';

const store = createStore(reducers);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
