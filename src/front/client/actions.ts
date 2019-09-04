export type Action = SomeAction;

export interface SomeAction {
    type: 'SOME_ACTION';
    foo: number;
}

export function someAction(foo: Readonly<number>): SomeAction {
    return {
        type: 'SOME_ACTION',
        foo
    };
}
