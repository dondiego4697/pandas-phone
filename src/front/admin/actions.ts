export type Action = AdminAccessAction;

export interface AdminAccessAction {
    type: 'SET_ADMIN_ACCESS';
    isAccess: boolean;
}

export function setAdminAccess(isAccess: Readonly<boolean>): Action {
    return {
        type: 'SET_ADMIN_ACCESS',
        isAccess
    };
}
