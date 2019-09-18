export function iPhoneColorMapper(color: string): string | undefined {
    const mapper: Record<string, string> = {
        black: 'Черный',
        'black-jet': 'Черный оникс',
        'black-matte': 'Черный матовый',
        blue: 'Синий',
        coral: 'Коралловый',
        gold: 'Золотой',
        'product-red': 'PRODUCT(RED)',
        'rose-gold': 'Розовое золото',
        silver: 'Серебряный',
        'space-gray': 'Space gray',
        white: 'Белый',
        yellow: 'Желтый'
    };

    return mapper[color];
}

export function iPhoneModelMapper(model: string): string | undefined {
    const mapper: Record<string, string> = {
        '6s': '6S',
        7: '7',
        '7_plus': '7 Plus',
        8: '8',
        '8_plus': '8 Plus',
        se: 'SE',
        x: 'X',
        xr: 'XR',
        xs: 'XS',
        xs_max: 'XS Max'
    };

    return mapper[model];
}

export function airpodOriginalMapper(original: boolean): string {
    if (original) {
        return 'Оригинал';
    }

    return 'Копия';
}

export function airpodChargingMapper(charging: boolean): string {
    if (charging) {
        return 'Кейс заряжает';
    }

    return 'Кейс не заряжает';
}

export function getPrice(price: number, discount: number): string {
    return (price * (1 - discount / 100)).toFixed(2);
}
