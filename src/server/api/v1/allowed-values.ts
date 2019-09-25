interface IAllowedValues {
    orderStatus: string[];
    goodItemType: string[];
}

export const allowedValues: IAllowedValues = {
    orderStatus: ['new', 'called', 'reject', 'bought'],
    goodItemType: ['iphone', 'airpod']
};
