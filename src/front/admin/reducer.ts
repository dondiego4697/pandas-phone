import {Reducer} from 'redux';

import {Action} from 'admin/actions';
import {AppState} from 'admin/app-state';

const INITIAL_STATE: AppState = {
    foo: 600
};

function appReducer(state: AppState = INITIAL_STATE, action: Action): AppState {
    switch (action.type) {
        case 'SOME_ACTION':
            return {
                ...state,
                foo: action.foo
            };
        default:
            return state;
    }
}

// Use cast for avoid problem with strictFunctionTypes: `typeof appReducer` is not assignable to
// `Reducer<S>`.
export default appReducer as Reducer<AppState>;
