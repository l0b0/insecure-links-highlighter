name = $(notdir $(CURDIR))

nodejs_docker_image = $(name)-nodejs
ruby_docker_image = $(name)-ruby

extension_file = $(name).xpi

XML_EXTENSIONS = iml xml

build: $(extension_file)

$(extension_file): defaultOptions.js highlight.js icons _locales manifest.json options.html options.js
	zip -r -FS $@ $^

changelog: .git/HEAD ruby-docker-image
	docker run --env CHANGELOG_GITHUB_TOKEN=$(CHANGELOG_GITHUB_TOKEN) --rm $(ruby_docker_image) /changelog.sh

test: test-acceptance test-lint test-unit

test-acceptance: python-docker-image
	docker-compose down
	docker-compose run --rm acceptance_tests python -m unittest discover test/acceptance

test-unit: nodejs-docker-image
	docker run --rm $(nodejs_docker_image) /project/node_modules/.bin/mocha test/unit

test-lint: nodejs-docker-image python-docker-image
	docker run --rm $(nodejs_docker_image) /project/node_modules/.bin/eslint .
	docker-compose run --rm acceptance_tests pycodestyle --max-line-length=120 .

nodejs-docker-image:
	docker build --tag $(nodejs_docker_image) --file nodejs/Dockerfile .

python-docker-image:
	docker-compose build

ruby-docker-image:
	docker build --tag $(ruby_docker_image) --file ruby/Dockerfile .

clean:
	$(RM) $(name).xpi test/acceptance/*.png

.PHONY: build changelog nodejs-docker-image python-docker-image test test-acceptance test-lint test-unit

include make-includes/variables.mk make-includes/xml.mk
