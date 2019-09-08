CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_brand (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    value TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_product (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    value TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_model (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    value TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_color (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    value TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_type (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    value TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_pattern (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand UUID REFERENCES good_brand(id) ON DELETE RESTRICT NOT NULL,
    product UUID REFERENCES good_product(id) ON DELETE RESTRICT NOT NULL,
    model UUID REFERENCES good_model(id) ON DELETE RESTRICT NOT NULL,
    color UUID REFERENCES good_color(id) ON DELETE RESTRICT NOT NULL,
    type UUID REFERENCES good_type(id) ON DELETE RESTRICT NOT NULL,
    description TEXT,
    memory_capacity INTEGER
);

CREATE TABLE IF NOT EXISTS shop (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    good_pattern_id UUID REFERENCES good_pattern(id) ON DELETE RESTRICT NOT NULL,
    serial_number TEXT,
    imei TEXT,
    price INTEGER NOT NULL,
    discount SMALLINT DEFAULT 0,
    sold_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
