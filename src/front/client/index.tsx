import * as React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router-dom';
import {Provider} from 'mobx-react';

import * as models from 'client/models';
import RoutesApp from 'client/routes';

import {history} from 'libs/history';

render(
    (
        <Provider {...models}>
            <React.Fragment>
                <Router history={history}>
                    <RoutesApp />
                </Router>
            </React.Fragment>
        </Provider>
    ),
    document.getElementById('root')
);
