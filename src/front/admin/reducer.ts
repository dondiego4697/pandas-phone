import {Reducer} from 'redux';

import {Action} from 'admin/actions';
import {AppState} from 'admin/app-state';

const DEFAULT_APP_STATE = {
    adminForbidden: true
};

function appReducer(state: AppState = DEFAULT_APP_STATE as AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_ADMIN_ACCESS':
            return {
                ...state,
                adminForbidden: action.isAccess
            };
        default:
            return state;
    }
}

// Use cast for avoid problem with strictFunctionTypes: `typeof appReducer` is not assignable to
// `Reducer<S>`.
export default appReducer as Reducer<AppState>;
