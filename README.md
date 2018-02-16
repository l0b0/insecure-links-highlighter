# Insecure Links Highlighter [![Build Status](https://travis-ci.org/l0b0/insecure-links-highlighter.svg?branch=master)](https://travis-ci.org/l0b0/insecure-links-highlighter)

Browser add-on to highlight insecure links such as "http://example.org" and "ftp://example.org". Let's get nicely meta and see how the previous sentence is rendered with the add-on installed: ![Screenshot of above sentence](screenshots/README.png "Screenshot of above sentence")

## Download

[Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/insecure-links-highlighter/?src=userprofile)

## Build

    make

If you get errors generating the change log, [get a new token](https://github.com/settings/tokens/new) and run `make CHANGELOG_GITHUB_TOKEN=[your token] changelog`. See the [GitHub Changelog Generator documentation](https://github.com/skywinder/github-changelog-generator#github-token) for details.

## Test

    make test
    docker-compose stop

Dependencies:

- Docker Compose
- GNU Make

## Release

1. Update version in [manifest.json](manifest.json)
1. Make sure the project builds:

        make clean build test
1. Commit changes
1. Tag the release:

        git tag $(jq -r .version < manifest.json) -m "Release"
1. Push the changes:

        git push
        git push --tags
1. Create the change log:

        make changelog
1. [Upload](https://addons.mozilla.org/en-US/developers/addon/insecure-links-highlighter/versions/submit/) the new .xpi
1. Submit the change log markup

## [License](LICENSE)

GNU GPL version 3 or later.
