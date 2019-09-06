CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_type (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS good_brand (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS good_brand_product (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    -- brand apple, sumsung
    brand_id UUID REFERENCES good_brand(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS good (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    -- type_id phone | protect_case
    type_id UUID REFERENCES good_type(id) ON DELETE RESTRICT NOT NULL,
    -- product_name iPhone, iPad, Galaxy Note // search in lowercase
    brand_product UUID REFERENCES good_brand_product(id) ON DELETE RESTRICT,
    -- model 6, XS, 9, 7 plus
    model TEXT,
    -- in GB
    memory_capacity REAL,
    color TEXT
);

CREATE TABLE IF NOT EXISTS shop (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    good_id UUID REFERENCES good(id) ON DELETE RESTRICT NOT NULL,
    serial_number TEXT,
    imei TEXT,
    price INTEGER NOT NULL,
    discount SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shop_statistic (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    good_id UUID REFERENCES good(id) ON DELETE RESTRICT NOT NULL,
    serial_number TEXT,
    imei TEXT,
    price INTEGER NOT NULL,
    discount SMALLINT DEFAULT 0,
    sold_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);
