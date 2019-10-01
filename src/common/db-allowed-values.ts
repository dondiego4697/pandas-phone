export interface IDbAllowedValues {
    'goodItem.type': string[];
    'goodItem.brand': string[];
    'goodItem.searchTag': string[];

    'goodItem.iphoneMemoryCapacity': number[];
    'goodItem.iphone.model': string[];
    'goodItem.iphone.color': string[];

    'goodItem.airpod.model': string[];
    'goodItem.airpod.color': string[];
}

export const dbAllowedValues: IDbAllowedValues = {
    'goodItem.type': ['iphone', 'airpod'],
    'goodItem.brand': ['apple'],
    'goodItem.searchTag': ['charging_case', 'best_seller'],
    'goodItem.iphoneMemoryCapacity': [8, 16, 32, 64, 128, 256, 512, 1024],

    'goodItem.iphone.model': [
        '11_pro_max', '11_pro', '11',
        'xs', 'x', 'xs_max', 'xr',
        '8', '8_plus',
        '7', '7_plus',
        '6s', '6', 'se'
    ],
    'goodItem.airpod.color': ['white'],

    'goodItem.airpod.model': ['series_1', 'series_2'],
    'goodItem.iphone.color': [
        'silver', 'gold', 'white', 'yellow',
        'coral', 'blue', 'black', 'rose_gold',
        'space_gray', 'product_red',
        'black_matte', 'black_jet', 'red'
    ]
};
