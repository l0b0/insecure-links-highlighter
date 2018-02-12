name = $(notdir $(CURDIR))

nodejs_docker_image = $(name)-nodejs

test: test-acceptance test-lint test-unit

test-acceptance: python_docker_image
	docker-compose run --rm acceptance_tests python -m unittest discover test/acceptance

test-unit: nodejs_docker_image
	docker run --rm $(nodejs_docker_image) /build/node_modules/.bin/mocha test/unit

test-lint: nodejs_docker_image python_docker_image
	docker run --rm $(nodejs_docker_image) /build/node_modules/.bin/eslint highlight.js test/unit/test.js
	docker-compose run --rm acceptance_tests pycodestyle --max-line-length=120 test/acceptance/test.py

nodejs_docker_image:
	docker build --tag $(nodejs_docker_image) --file nodejs/Dockerfile .

python_docker_image:
	docker-compose build

.PHONY: nodejs_docker_image python_docker_image test test-acceptance test-lint test-unit
