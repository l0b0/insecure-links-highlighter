name = $(notdir $(CURDIR))

docker_image = $(name)-nodejs

test: test-lint test-unit

test-unit: docker
	docker run --rm $(docker_image) /build/node_modules/.bin/mocha

test-lint: docker
	docker run --rm $(docker_image) /build/node_modules/.bin/eslint highlight.js test/unit.js

docker:
	docker build --tag $(docker_image) .

.PHONY: docker test test-lint test-unit
