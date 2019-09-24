import {IIphone, IAirpod} from 'client/models/main';
import {iPhoneColorMapper, airpodOriginalMapper, airpodChargingMapper} from 'client/libs/text-mapper';
import {ICardDescriptionField} from 'client/components/card-description';
import {getPriceWithDiscountString} from '@denstep/libs/get-price';

export function getIphoneDescriptionFields(iphone: IIphone): ICardDescriptionField[] {
    const fields: ICardDescriptionField[] = [
        {
            icon: 'brush',
            text: iPhoneColorMapper(iphone.color)!
        },
        {
            icon: 'storage',
            text: `${iphone.memory} GB`
        },
        {
            icon: 'cash',
            text: getPriceWithDiscountString(iphone.price, 0),
            textClassName: iphone.discount > 0 ? 'old-price' : 'price'
        }
    ];

    if (iphone.discount > 0) {
        fields.push({
            icon: 'discount',
            text: getPriceWithDiscountString(iphone.price, iphone.discount),
            textClassName: 'discount'
        });
    }

    return fields;
}

export function getAirpodDescriptionFields(airpod: IAirpod): ICardDescriptionField[] {
    const fields: ICardDescriptionField[] = [
        {
            icon: 'copyright',
            text: airpodOriginalMapper(airpod.original)
        },
        {
            icon: 'charge',
            text: airpodChargingMapper(airpod.original)
        },
        {
            icon: 'cash',
            text: getPriceWithDiscountString(airpod.price, 0),
            textClassName: airpod.discount > 0 ? 'old-price' : 'price'
        }
    ];

    if (airpod.discount > 0) {
        fields.push({
            icon: 'discount',
            text: getPriceWithDiscountString(airpod.price, airpod.discount),
            textClassName: 'discount'
        });
    }

    return fields;
}
