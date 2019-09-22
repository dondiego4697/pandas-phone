OUT_DIR := out

before-server-build = $(OUT_DIR)/node_modules

$(OUT_DIR)/node_modules:
	mkdir -p $@
	ln -s ../src/server $@

.PHONY: deps
deps:
	npm install

.PHONY: validate
validate: lint

.PHONY: lint
lint:
	node_modules/.bin/tslint -p src/server/tsconfig.json -c tslint.json -t codeFrame 'src/server/**/*.ts'
	node_modules/.bin/tslint -p src/front/admin/tsconfig.json -c tslint.web.json -t codeFrame 'src/front/admin/**/*.{ts,tsx}'
	node_modules/.bin/tslint -c tslint.web.json -t codeFrame 'src/front/lib/**/*.{ts,tsx}'
	node_modules/.bin/tslint -p src/front/client/tsconfig.json -c tslint.web.json -t codeFrame 'src/front/client/**/*.{ts,tsx}'

.PHONY: dev
dev:
	$(MAKE) -j3 server-dev build-client-watch localtunnel

.PHONE: localtunnel
localtunnel:
	node_modules/.bin/lt --subdomain panda-phone --port 3000

.PHONY: server-dev
server-dev:
	node_modules/.bin/nodemon --exec " \
		node_modules/.bin/ts-node --files=true -r tsconfig-paths/register \
			--project ./src/server/tsconfig.json \
			./src/server/app.ts" \
	-w ./src \
	-w ./res \
	-e ts,mustache

.PHONY: clean
clean:
	rm -rf $(OUT_DIR)

.PHONY: build
build: clean build-server build-client

.PHONY: build-server
build-server: $(before-server-build)
	node_modules/.bin/tsc -p src/server/tsconfig.json

.PHONY: build-server-watch
build-server-watch: $(before-server-build)
	node_modules/.bin/tsc -w -p src/server/tsconfig.json

.PHONE: build-server-production
build-server-production: $(before-server-build)
	node_modules/.bin/tsc -p src/server/tsconfig-production.json

.PHONY: run-server
run-server:
	node $(OUT_DIR)/server/app.js

.PHONY: build-client
build-client:
	node_modules/.bin/parallel-webpack

.PHONY: build-client-watch
build-client-watch:
	node_modules/.bin/parallel-webpack --watch

.PHONY: build-client-production
build-client-production:
	node_modules/.bin/parallel-webpack -- --mode=production

.PHONY: migration
migration:
	node_modules/.bin/ts-node --files=true -r tsconfig-paths/register \
		--project ./src/server/tsconfig.json \
		./tools/make-migration.ts

.PHONY: patch minor major
patch minor major:
	echo 1
