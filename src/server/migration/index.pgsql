CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    login TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS good_type (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name: TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS good_brand (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name: TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS good_brand_product (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name: TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS good (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name: TEXT NOT NULL,
    description: TEXT,
    -- type_id: phone | protect_case
    type_id: UID REFERENCES good_type(id) ON DELETE RESTRICT NOT NULL,
    count: NUMBER NOT NULL DEFAULT 0,
    -- brand: apple, sumsung
    brand: UID REFERENCES good_brand(id) ON DELETE RESTRICT,
    -- product_name: iPhone, iPad, Galaxy Note
    brand_product: UID REFERENCES good_brand_product(id) ON DELETE RESTRICT,
    -- model: 6, XS, 9
    model: TEXT,
    ammount: MONEY NOT NULL,
    serial: TEXT,
    imei: TEXT
);

CREATE TABLE IF NOT EXISTS statistic (
    sold_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);
