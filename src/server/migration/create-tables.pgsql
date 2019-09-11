CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TODO create indexes

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TYPE IPHONE_MODEL_T as enum('XS', 'XS Max', 'XR', '8', '8 Plus', '7', '7 Plus', '6S', 'SE');
CREATE TYPE IPHONE_MEMORY_T as enum('16', '32', '64', '128', '256', '512');
CREATE TYPE IPHONE_COLOR_T as enum('серебристый', 'золотой', 'белый', 'желтый', 'коралловый', 'синий', 'черный', 'розовое золото', 'серый космос', '(PRODUCT)RED');
CREATE TABLE IF NOT EXISTS iphone (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model IPHONE_MODEL_T NOT NULL,
    color IPHONE_COLOR_T NOT NULL,
    memory_capacity IPHONE_MEMORY_T NOT NULL,

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,
    count SMALLINT NOT NULL DEFAULT 0
);

CREATE TYPE AIRPODS_SERIES_T as enum('1', '2');
CREATE TABLE IF NOT EXISTS airpods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    series AIRPODS_SERIES_T NOT NULL,
    is_original BOOLEAN DEFAULT TRUE,
    is_charging_case BOOLEAN DEFAULT TRUE,

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,
    count SMALLINT NOT NULL DEFAULT 0
);

CREATE TYPE ORDER_STATUS_T as enum('new', 'called', 'reject', 'bought');
CREATE TABLE IF NOT EXISTS "order" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,

    status ORDER_STATUS_T DEFAULT 'new' NOT NULL,

    order_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    sold_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TYPE ORDER_GOOD_TYPE_T as enum('iphone', 'airpods'); -- database name
CREATE TABLE IF NOT EXISTS order_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES "order"(id) ON DELETE RESTRICT,

    serial_number TEXT,
    imei TEXT,
    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,

    good_type ORDER_GOOD_TYPE_T NOT NULL,
    good_id UUID NOT NULL
);

CREATE OR REPLACE FUNCTION beforeOrderItemInsert() RETURNS TRIGGER AS
$BODY$
DECLARE
    item_id UUID;
BEGIN
    EXECUTE FORMAT('SELECT id FROM %I WHERE id=$1 LIMIT 1;', NEW.good_type) USING NEW.good_id INTO item_id;
    IF item_id IS NULL THEN
        RAISE EXCEPTION '% is not from % table', NEW.good_id, NEW.good_type;
    END IF;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER beforeOrderItemInsert BEFORE INSERT ON order_item FOR EACH ROW EXECUTE PROCEDURE beforeOrderItemInsert();

CREATE OR REPLACE FUNCTION afterOrderUpdate() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF NEW.status='bought' OR NEW.status='reject' THEN
        UPDATE "order" SET sold_date='now()' WHERE id=NEW.id;
    END IF;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER afterOrderUpdate AFTER UPDATE ON "order" FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE PROCEDURE afterOrderUpdate();
