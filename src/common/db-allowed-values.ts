interface IPair {
    key: string;
    value: string;
}

export interface IDbAllowedPairs {
    'goodItem.type': IPair[];
    'goodItem.brand': IPair[];
    'goodItem.searchTag': IPair[];

    'goodItem.iphone.memoryCapacity': IPair[];
    'goodItem.iphone.model': IPair[];
    'goodItem.iphone.color': IPair[];

    'goodItem.airpod.color': IPair[];
    'goodItem.airpod.model': IPair[];
    'order.status': IPair[];
}

export const dbAllowedPairs: IDbAllowedPairs = {
    'goodItem.type': [
        {
            key: 'iphone',
            value: 'iPhone'
        },
        {
            key: 'airpod',
            value: 'AirPods'
        }
    ],
    'goodItem.brand': [
        {
            key: 'apple',
            value: 'Apple'
        }
    ],
    'goodItem.searchTag': [
        {
            key: 'charging_case',
            value: 'Заряжающий кейс'
        },
        {
            key: 'best_seller',
            value: 'Бестселлер'
        }
    ],
    'goodItem.iphone.memoryCapacity': [8, 16, 32, 64, 128, 256, 512, 1024].map((x) => ({
        key: String(x),
        value: String(x)
    })),
    'goodItem.iphone.model': [
        {
            key: '11_pro_max',
            value: '11 Pro Max'
        },
        {
            key: '11_pro',
            value: '11 Pro'
        },
        {
            key: '11',
            value: '11'
        },
        {
            key: 'xs',
            value: 'XS'
        },
        {
            key: 'x',
            value: 'X'
        },
        {
            key: 'xs_max',
            value: 'XS Max'
        },
        {
            key: 'xr',
            value: 'XR'
        },
        {
            key: '8',
            value: '8'
        },
        {
            key: '8_plus',
            value: '8 Plus'
        },
        {
            key: '7',
            value: '7'
        },
        {
            key: '7_plus',
            value: '7 Plus'
        },
        {
            key: '6',
            value: '6'
        },
        {
            key: '6s',
            value: '6S'
        },
        {
            key: 'se',
            value: 'SE'
        }
    ],
    'goodItem.iphone.color': [
        {
            key: 'silver',
            value: 'Серебро'
        },
        {
            key: 'gold',
            value: 'Золотой'
        },
        {
            key: 'white',
            value: 'Белый'
        },
        {
            key: 'yellow',
            value: 'Желтый'
        },
        {
            key: 'coral',
            value: 'Кораловый'
        },
        {
            key: 'blue',
            value: 'Синий'
        },
        {
            key: 'black',
            value: 'Черный'
        },
        {
            key: 'red',
            value: 'Красный'
        },
        {
            key: 'rose_gold',
            value: 'Розовое золото'
        },
        {
            key: 'space_gray',
            value: 'Серый космос'
        },
        {
            key: 'product_red',
            value: 'PRODUCT(RED)'
        },
        {
            key: 'black_matte',
            value: 'Черный матовый'
        },
        {
            key: 'black_jet',
            value: 'Черный оникс'
        }
    ],
    'goodItem.airpod.color': [
        {
            key: 'white',
            value: 'Белый'
        }
    ],
    'goodItem.airpod.model': [
        {
            key: 'series_1',
            value: 'Серия 1'
        },
        {
            key: 'series_2',
            value: 'Серия 2'
        }
    ],
    'order.status': [
        {
            key: 'resolve',
            value: 'Решено'
        },
        {
            key: 'reject',
            value: 'Отказано'
        },
    ]
};

export function getDbAllowedKeys(key: keyof IDbAllowedPairs): (string | number)[] {
    return dbAllowedPairs[key].map((item) => item.key);
}

export function getDbAllowedValue(
    mapKeyRaw: keyof IDbAllowedPairs | (keyof IDbAllowedPairs)[],
    key: string | number | null
): string | number | null {
    if (!key) {
        return null;
    }

    let mapKeys = [] as (keyof IDbAllowedPairs)[];
    if (!Array.isArray(mapKeyRaw)) {
        mapKeys = [mapKeyRaw];
    } else {
        mapKeys = mapKeyRaw;
    }

    for (const mapKey of mapKeys) {
        const res = dbAllowedPairs[mapKey].find((x) => x.key === key);
        if (res) {
            return res.value;
        }
    }

    return null;
}
