# Contributing

## Environment
```bash
export PANDA_PHONE_DB_HOST=$(value)
export PANDA_PHONE_DB_USER=$(value)
export PANDA_PHONE_DB_PASSWORD=$(value)
export PANDA_PHONE_DB_NAME=$(value)
export PANDA_PHONE_DB_PORT=$(value)

export PANDA_PHONE_TELEGRAM_BOT_API_TOKEN=$(value)

export NODEJS_PORT=$(value)
export DISABLE_LOGGING=$(value)
export NODEJS_ENV=$(value)
```

## Database instruction
```bash
CREATE USER $(username) WITH SUPERUSER CREATEDB CREATEROLE REPLICATION BYPASSRLS PASSWORD '$(password)';
CREATE DATABASE $(dbname) WITH ENCODING 'UTF8' OWNER $(rolename);
SET timezone='UTC';
```

## Commands
```bash
sudo docker run -it -p 3000:80 --env-file ./panda-phone-env.list -d cr.yandex/crpn0q4tiksugq5qds8d/ubuntu:0.0.7
```
