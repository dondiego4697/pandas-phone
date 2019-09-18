export function iPhoneColorMapper(color: string): string | undefined {
    const mapper: Record<string, string> = {
        black: 'Черный',
        'black jet': 'Черный оникс',
        'black matte': 'Черный матовый',
        blue: 'Синий',
        coral: 'Коралловый',
        gold: 'Золотой',
        'product-red': 'PRODUCT(RED)',
        'rose gold': 'Розовое золото',
        silver: 'Серебряный',
        'space gray': 'Space gray',
        white: 'Белый',
        yellow: 'Желтый'
    };

    return mapper[color];
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
