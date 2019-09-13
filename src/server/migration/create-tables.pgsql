CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TYPE IPHONE_MODEL_T as enum('XS', 'XS Max', 'XR', '8', '8 Plus', '7', '7 Plus', '6S', 'SE');
CREATE TYPE IPHONE_MEMORY_T as enum('16', '32', '64', '128', '256', '512');
CREATE TYPE IPHONE_COLOR_T as enum(
    'silver', 'gold', 'white', 'yellow',
    'coral', 'blue', 'black', 'rose gold',
    'space gray', 'product-red',
    'black matte', 'black jet'
);
CREATE TABLE IF NOT EXISTS iphone (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model IPHONE_MODEL_T NOT NULL,
    color IPHONE_COLOR_T NOT NULL,
    memory_capacity IPHONE_MEMORY_T NOT NULL,

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,

    serial_number TEXT NOT NULL UNIQUE,
    imei TEXT NOT NULL UNIQUE,

    is_sold BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TYPE AIRPOD_SERIES_T as enum('1', '2');
CREATE TABLE IF NOT EXISTS airpod (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    series AIRPOD_SERIES_T NOT NULL,
    is_original BOOLEAN DEFAULT FALSE,
    is_charging_case BOOLEAN DEFAULT FALSE,

    price INTEGER NOT NULL,
    discount SMALLINT NOT NULL DEFAULT 0,

    serial_number TEXT NOT NULL UNIQUE,

    is_sold BOOLEAN NOT NULL DEFAULT FALSE
);

-- TODO create table iphone_accessory

CREATE TYPE ORDER_STATUS_T as enum('new', 'called', 'reject', 'bought');
CREATE TABLE IF NOT EXISTS "order" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,

    status ORDER_STATUS_T DEFAULT 'new' NOT NULL,

    order_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    sold_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS order_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES "order"(id) ON DELETE RESTRICT NOT NULL,
    iphone_id UUID REFERENCES iphone(id) ON DELETE RESTRICT UNIQUE,
    airpod_id UUID REFERENCES airpod(id) ON DELETE RESTRICT UNIQUE
);

CREATE OR REPLACE FUNCTION afterOrderUpdate() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF NEW.status='bought' THEN
        UPDATE "order" SET sold_date='now()' WHERE id=NEW.id;
        UPDATE iphone SET is_sold=true FROM order_item WHERE order_id=NEW.id AND iphone_id=iphone.id;
        UPDATE airpod SET is_sold=true FROM order_item WHERE order_id=NEW.id AND airpod_id=airpod.id;
    END IF;
    IF NEW.status='reject' THEN
        UPDATE "order" SET sold_date='now()' WHERE id=NEW.id;
        DELETE FROM order_item WHERE order_id=NEW.id;
    END IF;
    RETURN new;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER afterOrderUpdate AFTER UPDATE ON "order" FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE PROCEDURE afterOrderUpdate();
