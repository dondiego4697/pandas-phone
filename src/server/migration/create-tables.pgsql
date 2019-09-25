CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'new',

    order_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolution_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS good_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    type TEXT NOT NULL,
    model TEXT DEFAULT NULL,
    brand TEXT DEFAULT NULL,
    color TEXT DEFAULT NULL,
    memory_capacity INTEGER DEFAULT NULL,
    series INTEGER DEFAULT NULL,
    original BOOLEAN DEFAULT TRUE NOT NULL,

    search_tags TEXT[] DEFAULT NULL,

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,

    public BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX good_item__model ON good_item (LOWER(model));
CREATE INDEX good_item__brand ON good_item (LOWER(brand));
CREATE INDEX good_item__color ON good_item (LOWER(color));
CREATE INDEX good_item__memory_capacity ON good_item (memory_capacity);
CREATE INDEX good_item__series ON good_item (series);
CREATE INDEX good_item__original ON good_item (original);
CREATE INDEX good_item__search_tags ON good_item (search_tags);
CREATE INDEX good_item__price_discount ON good_item (price, discount);
CREATE INDEX good_item__public ON good_item (public);


CREATE TABLE IF NOT EXISTS order_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE RESTRICT NOT NULL,
    good_item_id UUID REFERENCES good_item(id) ON DELETE RESTRICT NOT NULL,

    serial_number TEXT UNIQUE DEFAULT NULL,
    imei TEXT UNIQUE DEFAULT NULL,

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION afterOrderUpdate() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF NEW.status='bought' OR NEW.status='reject' THEN
        UPDATE orders SET resolution_date='now()' WHERE id=NEW.id;
        -- UPDATE iphone SET archive=true FROM order_item WHERE order_id=NEW.id AND iphone_id=iphone.id;
    END IF;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER afterOrderUpdate AFTER UPDATE ON orders FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE PROCEDURE afterOrderUpdate();

