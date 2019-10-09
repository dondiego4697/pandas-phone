import {URL} from 'url';

import {logger} from 'server/lib/logger';
import {request} from 'server/lib/request';
import {config} from 'server/config';

const telegramApiHost = `https://api.telegram.org`;

export class TelegramBot {
    static async sendMessageToWorkChat(text: string): Promise<void> {
        const url = new URL(`/bot${process.env.PANDA_PHONE_TELEGRAM_BOT_API_TOKEN}/sendMessage`, telegramApiHost);
        const body = {
            chat_id: config['telegram.workChatId'],
            text,
            parse_mode: 'HTML'
        };

        if (!config['telegram.writeToWorkChat']) {
            logger.info(`TELEGRAM MOCK: POST => ${url}, ${JSON.stringify(body)}`);
            return;
        }

        try {
            await request(url, {
                method: 'POST',
                body,
                json: true,
                timeout: config['telegram.timeout']
            });
        } catch (err) {
            return;
        }
    }

    static messageCreateNewOrder(id: string, ammount: string): string {
        return [
            '<b>Создан новый заказ</b>',
            `ID: <i>${id}</i>`,
            `Сумма: <i>${ammount}</i>`
        ].join('\n');
    }

    static messageCreateNewOrderError(message: string): string {
        return [
            '<b>Ошибка при создании нового заказа</b>',
            `<code>${message}</code>`
        ].join('\n');
    }

    static messageMakeOrderResolution(id: string, status: string) {
        return [
            `<b>Резулюция заказа: ${status}</b>`,
            `ID: <i>${id}</i>`
        ].join('\n');
    }
}
