name = $(notdir $(CURDIR))

docker_image = $(name)-nodejs

test-lint:
	docker build --tag $(docker_image) .
	docker run --rm $(docker_image) /build/node_modules/.bin/eslint highlight.js

.PHONY: test-lint
