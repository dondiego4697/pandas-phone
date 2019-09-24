import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {IphoneProvider} from 'server/routers/api/v2/providers/iphone';
import {AirpodProvider} from 'server/routers/api/v2/providers/airpod';
import {OrderValidatorRequest} from 'server/routers/api/v2/validators/order';
import {getPgClient, makeTransactionRequest, makeRequest} from 'server/db/client';
import {OrderProvider} from 'server/routers/api/v2/providers/order';
import {TelegramBot as TB} from 'server/lib/telegram-bot';

export const publicRouter = express.Router();

publicRouter.get('/iphone_enums', wrap<Request, Response>(async (req, res) => {
    res.json(await IphoneProvider.getIphoneEnums());
}));

publicRouter.get('/bar_items', wrap<Request, Response>(async (req, res) => {
    const iphones = await IphoneProvider.getIphoneBarItemsAll();
    const airpods = await AirpodProvider.getAirpodBarItemsAll();

    res.json({
        iphones: iphones.map((iphone) => ({
            id: iphone.id,
            model: iphone.model,
            color: iphone.color,
            memory: iphone.memory_capacity,
            price: iphone.price,
            discount: iphone.discount
        })),
        airpods: airpods.map((airpod) => ({
            id: airpod.id,
            series: airpod.series,
            original: airpod.original,
            charging: airpod.charging_case,
            price: airpod.price,
            discount: airpod.discount
        }))
    });
}));

publicRouter.post('/add_customer_order', wrap<Request, Response>(async (req, res) => {
    const body = OrderValidatorRequest.validateCustomerOrderCreate(req.body);
    const {airpodIds, iphoneIds, customer: {name, phone}} = body;

    const client = await getPgClient();
    try {
        await makeTransactionRequest(client, {text: 'BEGIN'});

        const [order] = await OrderProvider.createOrder(client, {
            customer_name: name,
            customer_phone: phone
        });

        if (airpodIds.length > 0) {
            const queryResults = await Promise.all(airpodIds.map((id) => {
                return makeTransactionRequest(client, {
                    text: `
                        INSERT INTO airpod_order (series, original, charging_case, price, discount)
                            SELECT series, original, charging_case, price, discount
                            FROM airpod_bar
                            WHERE id=$1
                        RETURNING id;
                    `,
                    values: [id]
                });
            }));

            await Promise.all(queryResults.map(({rows: [row]}) => {
                return OrderProvider.addAirpodOrder(client, order.id, row.id);
            }));
        }

        if (iphoneIds.length > 0) {
            const queryResults = await Promise.all(iphoneIds.map((id) => {
                return makeTransactionRequest(client, {
                    text: `
                        INSERT INTO iphone_order (model, color, memory_capacity, price, discount)
                            SELECT model, color, memory_capacity, price, discount
                            FROM iphone_bar
                            WHERE id=$1
                        RETURNING id;
                    `,
                    values: [id]
                });
            }));

            await Promise.all(queryResults.map(({rows: [row]}) => {
                return OrderProvider.addIphoneOrder(client, order.id, row.id);
            }));
        }

        await makeTransactionRequest(client, {text: 'COMMIT'});

        const {rows: [sum]} = await makeRequest({
            text: `
                SELECT
                       SUM((airpod_order.price / 100) * (100 - airpod_order.discount)) as airpodSum,
                       SUM((iphone_order.price / 100) * (100 - iphone_order.discount)) as iphoneSum
                FROM order_item
                    LEFT JOIN airpod_order ON order_item.airpod_id = airpod_order.id
                    LEFT JOIN iphone_order ON order_item.iphone_id = iphone_order.id
                WHERE order_item.order_id=$1;
            `,
            values: [order.id]
        });
        const resultSum = String(Number(sum.airpodsum) + Number(sum.iphonesum));
        TB.sendMessageToChat(TB.messageNewOrder(order.id, resultSum));
    } catch (err) {
        await makeTransactionRequest(client, {text: 'ROLLBACK'});
        TB.sendMessageToChat(TB.messageNewOrderError(JSON.stringify({error: err.message, body})));
        throw err;
    } finally {
        client.release();
    }

    res.json([]);
}));
