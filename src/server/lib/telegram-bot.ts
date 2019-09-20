import {URL} from 'url';
import * as got from 'got';

import {logger} from 'server/lib/logger';
import {config} from 'server/config';
import {OrderStatus} from 'server/routers/api/v2/validators/order';

const telegramApiHost = `https://api.telegram.org`;

export class TelegramBot {
    static async sendMessageToChat(text: string): Promise<void> {
        const url = new URL(`/bot${process.env.PANDA_PHONE_TELEGRAM_BOT_API_TOKEN}/sendMessage`, telegramApiHost);

        const params = {
            chat_id: config['telegram.workChatId'],
            text,
            parse_mode: 'HTML'
        };

        const requestInfo = `POST => ${url} body=${JSON.stringify(params)}`;
        logger.debug(`Request ${requestInfo}`);

        let checkRes: got.Response<any>;
        try {
            checkRes = await got.post(url, {
                body: params,
                json: true,
                timeout: config['telegram.timeout']
            });
        } catch (err) {
            logger.error(`Request ${requestInfo} failed: ${err}`);
            return;
        }

        const checkResLogMessage = `Got response for ${requestInfo}: ` +
            `statusCode=${checkRes.statusCode}, body=${JSON.stringify(checkRes.body)}`;

        if (checkRes.statusCode !== 200) {
            logger.error(checkResLogMessage);
            return;
        }
    }

    static messageNewOrder(id: string, ammount: string): string {
        return [
            '<b>Поступил новый заказ</b>',
            `ID: <i>${id}</i>`,
            `Сумма: <i>${ammount}</i>`
        ].join('\n');
    }

    static messageNewOrderError(message: string): string {
        return [
            '<b>Ошибка при отправке нового заказа</b>',
            `<code>${message}</code>`
        ].join('\n');
    }

    static messageUpdateOrderStatus(id: string, status: OrderStatus) {
        const statusMessage = status === 'called' ?
            'Заказ прозвонен' : status === 'bought' ?
            'Заказ продан' : 'Отказ заказа';

        return [
            `<b>${statusMessage}</b>`,
            `ID: <i>${id}</i>`
        ].join('\n');
    }
}
