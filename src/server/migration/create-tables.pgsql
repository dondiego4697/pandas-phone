CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_pattern (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    description TEXT,
    brand TEXT NOT NULL,
    product TEXT NOT NULL,
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    category TEXT NOT NULL,
    memory_capacity INTEGER
);

CREATE TABLE IF NOT EXISTS shop_item (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    good_pattern_id UUID REFERENCES good_pattern(id) ON DELETE RESTRICT NOT NULL,
    price INTEGER NOT NULL,
    discount SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "order" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    good_pattern_id UUID REFERENCES good_pattern(id) ON DELETE RESTRICT NOT NULL,
    serial_number TEXT,
    imei TEXT,
    price INTEGER NOT NULL,
    discount SMALLINT DEFAULT 0,

    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    is_called BOOLEAN DEFAULT FALSE,

    order_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    sold_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    UNIQUE(serial_number, imei)
);
