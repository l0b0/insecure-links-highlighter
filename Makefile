GRADLE_USER ?= gradle

name = $(notdir $(CURDIR))

nodejs_docker_image = $(name)-nodejs
ruby_docker_image = $(name)-ruby

extension_file = $(name).xpi

XML_EXTENSIONS = iml xml

icons = icons/48.png icons/96.png

build: $(extension_file)

$(extension_file): defaultOptions.js dom.js highlight.js $(icons) _locales manifest.json options.html options.js url.js
	zip -r -FS $@ $^

icons/%.png: icons/icon.svg
	convert -resize $*x$* $< $@
	optipng -out /tmp/icon.png $@
	mv /tmp/icon.png $@

changelog: .git/HEAD ruby-docker-image
	docker run --env CHANGELOG_GITHUB_TOKEN=$(CHANGELOG_GITHUB_TOKEN) --rm $(ruby_docker_image) /changelog.sh

test: test-acceptance test-lint test-unit

test-acceptance: acceptance-test-image $(extension_file)
	docker-compose run --rm --user=$(GRADLE_USER) acceptance_tests gradle --info test

test-unit: nodejs-docker-image
	docker run --rm $(nodejs_docker_image) /project/node_modules/.bin/mocha test/unit

test-lint: nodejs-docker-image acceptance-test-image
	docker run --rm $(nodejs_docker_image) /project/node_modules/.bin/eslint .

nodejs-docker-image:
	docker build --tag $(nodejs_docker_image) --file nodejs/Dockerfile .

acceptance-test-image:
	docker-compose down
	docker-compose build

ruby-docker-image:
	docker build --tag $(ruby_docker_image) --file ruby/Dockerfile .

# Should print nothing if the clean target is up to date
verify-clean:
	git clean -ndx

clean:
	$(RM) --recursive .gradle build $(extension_file) icons/*.png test/acceptance/*.png

.PHONY: acceptance-test-image build changelog clean nodejs-docker-image ruby-docker-image test test-acceptance test-lint test-unit

include make-includes/variables.mk make-includes/xml.mk
