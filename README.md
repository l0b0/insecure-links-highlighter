# Insecure Links Highlighter [![Build Status](https://travis-ci.org/l0b0/insecure-links-highlighter.svg?branch=master)](https://travis-ci.org/l0b0/insecure-links-highlighter)

Easily notice insecure links in Firefox by their bright red border. Highlights these types of links and more:

- <a href="http://example.org">http://example.org</a>
- <a href="ftp://example.org">ftp://example.org</a>
- <span onmousedown="location='http://example.org'">`on*` event handlers</span>

## Download

[Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/insecure-links-highlighter/?src=userprofile)

## Build

    make

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

        make CHANGELOG_GITHUB_TOKEN=[your token] changelog
1. [Upload](https://addons.mozilla.org/en-US/developers/addon/insecure-links-highlighter/versions/submit/) the new .xpi
1. Submit the change log markup

Dependencies:

- [GitHub token](https://github.com/settings/tokens/new). See the [GitHub Changelog Generator documentation](https://github.com/skywinder/github-changelog-generator#github-token) for details.
- jq
- Test dependencies (see above)

## [License](LICENSE)

GNU GPL version 3 or later.
