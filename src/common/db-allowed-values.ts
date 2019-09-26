export interface IDbAllowedValues {
    goodItemType: string[];
    iphoneModels: string[];
    iphoneMemories: number[];
    iphoneColors: string[];
    airpodModels: string[];
    airpodColors: string[];
    searchTags: string[];
}

export const dbAllowedValues: IDbAllowedValues = {
    goodItemType: ['iphone', 'airpod'],
    airpodColors: ['white'],
    iphoneModels: [
        '11_pro_max', '11_pro', '11',
        'xs', 'x', 'xs_max', 'xr',
        '8', '8_plus',
        '7', '7_plus',
        '6s', '6', 'se'
    ],
    airpodModels: ['series_1', 'series_2'],
    iphoneMemories: [16, 32, 64, 128, 256, 512],
    iphoneColors: [
        'silver', 'gold', 'white', 'yellow',
        'coral', 'blue', 'black', 'rose_gold',
        'space_gray', 'product_red',
        'black_matte', 'black_jet', 'red'
    ],
    searchTags: ['charging_case', 'best_seller']
};
