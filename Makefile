name = $(notdir $(CURDIR))

nodejs_docker_image = $(name)-nodejs

extension_file = $(name).xpi

build: $(extension_file)

$(extension_file): highlight.js icon.svg _locales manifest.json
	zip -r -FS $@ $^

test: test-acceptance test-lint test-unit

test-acceptance: python-docker-image
	docker-compose down
	docker-compose run --rm acceptance_tests python -m unittest discover test/acceptance

test-unit: nodejs-docker-image
	docker run --rm $(nodejs_docker_image) /build/node_modules/.bin/mocha test/unit

test-lint: nodejs-docker-image python-docker-image
	docker run --rm $(nodejs_docker_image) /build/node_modules/.bin/eslint highlight.js test/unit/test.js
	docker-compose run --rm acceptance_tests pycodestyle --max-line-length=120 test/acceptance/test.py

nodejs-docker-image:
	docker build --tag $(nodejs_docker_image) --file nodejs/Dockerfile .

python-docker-image:
	docker-compose build

.PHONY: build nodejs-docker-image python-docker-image test test-acceptance test-lint test-unit
