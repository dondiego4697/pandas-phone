CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    yandex_user_id TEXT UNIQUE NOT NULL,
    login TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS stat_v1 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    status TEXT NOT NULL,
    data JSONB DEFAULT NULL,
    resolution_date TIMESTAMP WITH TIME ZONE DEFAULT now()  NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    called BOOLEAN DEFAULT FALSE NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    _status_v1 TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS good_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    type TEXT NOT NULL,
    model TEXT DEFAULT NULL,
    brand TEXT DEFAULT NULL,
    color TEXT DEFAULT NULL,
    memory_capacity INTEGER DEFAULT NULL,
    original BOOLEAN DEFAULT TRUE NOT NULL,

    search_tags TEXT[] NOT NULL DEFAULT '{}',

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,

    public BOOLEAN DEFAULT FALSE NOT NULL,

    updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS good_item__model ON good_item (LOWER(model));
CREATE INDEX IF NOT EXISTS good_item__brand ON good_item (LOWER(brand));
CREATE INDEX IF NOT EXISTS good_item__color ON good_item (LOWER(color));
CREATE INDEX IF NOT EXISTS good_item__memory_capacity ON good_item (memory_capacity);
CREATE INDEX IF NOT EXISTS good_item__original ON good_item (original);
CREATE INDEX IF NOT EXISTS good_item__search_tags ON good_item (search_tags);
CREATE INDEX IF NOT EXISTS good_item__price_discount ON good_item (price, discount);
CREATE INDEX IF NOT EXISTS good_item__public ON good_item (public);

CREATE TABLE IF NOT EXISTS order_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE RESTRICT NOT NULL,
    good_item_id UUID REFERENCES good_item(id) ON DELETE RESTRICT NOT NULL,

    serial_number TEXT UNIQUE DEFAULT NULL,
    imei TEXT UNIQUE DEFAULT NULL
);

CREATE OR REPLACE FUNCTION setOrderResolution() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF NEW._status_v1='resolve' THEN
        IF (SELECT COUNT(*) FROM order_item WHERE order_id=NEW.id AND serial_number IS NULL) > 0 THEN
            RAISE EXCEPTION 'EMPTY_SERIAL_NUMBER';
        END IF;
    END IF;

    IF NEW._status_v1='resolve' OR NEW._status_v1='reject' THEN
        INSERT INTO stat_v1
            (status, data)
        VALUES (
            NEW._status_v1,
            (SELECT to_json(result)
            FROM (
            SELECT
                to_json(orders)::jsonb as "order",
                json_agg(order_item)::jsonb as order_item,
                json_agg(good_item)::jsonb as good_item
            FROM order_item
                INNER JOIN good_item ON order_item.good_item_id = good_item.id
                INNER JOIN orders ON order_item.order_id = orders.id
                WHERE order_id=NEW.id
                GROUP BY orders.id
            ) result)
        );

        DELETE FROM order_item WHERE order_id=NEW.id;
        DELETE FROM orders WHERE id=NEW.id;
        -- UPDATE iphone SET archive=true FROM order_item WHERE order_id=NEW.id AND iphone_id=iphone.id;
    END IF;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER setOrderResolutionTrigger AFTER UPDATE
    ON orders FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE PROCEDURE setOrderResolution();

CREATE OR REPLACE FUNCTION checkGoodItemUpdateEnabled() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF (SELECT COUNT(*) FROM order_item WHERE good_item_id=NEW.id) > 0 THEN
        RAISE EXCEPTION 'GOOD_ITEM_USED_IN_ORDER';
    END IF;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER checkGoodItemUpdateEnabledTrigger BEFORE UPDATE
    ON good_item FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE PROCEDURE checkGoodItemUpdateEnabled();

CREATE OR REPLACE FUNCTION updateGoodItemUpdatedDate() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE good_item SET updated=now() WHERE id=NEW.id;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER updateGoodItemUpdatedDateTrigger AFTER UPDATE
    ON good_item FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE PROCEDURE updateGoodItemUpdatedDate();
