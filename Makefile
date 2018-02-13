name = $(notdir $(CURDIR))

nodejs_docker_image = $(name)-nodejs

extension_file = $(name).xpi

current_tag = $(shell git tag --list --points-at HEAD)
previous_tag = $(shell git describe --abbrev=0 --tags $(shell git rev-list --tags --skip=1 --max-count=1))

build: $(extension_file)

$(extension_file): highlight.js icon.svg _locales manifest.json
	zip -r -FS $@ $^

changelog:
	git log $(previous_tag)...$(current_tag) --pretty=format:'- %s <https://github.com/l0b0/insecure-links-highlighter/commit/%H>' --reverse

test: test-acceptance test-lint test-unit

test-acceptance: python-docker-image
	docker-compose down
	docker-compose run --rm acceptance_tests python -m unittest discover test/acceptance

test-unit: nodejs-docker-image
	docker run --rm $(nodejs_docker_image) /project/node_modules/.bin/mocha test/unit

test-lint: nodejs-docker-image python-docker-image
	docker run --rm $(nodejs_docker_image) /project/node_modules/.bin/eslint highlight.js test/unit/test.js
	docker-compose run --rm acceptance_tests pycodestyle --max-line-length=120 test/acceptance/test.py

nodejs-docker-image:
	docker build --tag $(nodejs_docker_image) --file nodejs/Dockerfile .

python-docker-image:
	docker-compose build

.PHONY: build changelog nodejs-docker-image python-docker-image test test-acceptance test-lint test-unit
