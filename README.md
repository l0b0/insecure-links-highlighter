# Insecure Links Highlighter

Browser add-on to highlight insecure links such as "http://example.org" and "ftp://example.org".

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
2. Commit changes
3. Run all tests in a clean state:

        make clean test
4. Tag the release:

        git tag $version -m "Release"
5. Push the changes:

        git push
        git push --tags
6. Create the .xpi file and change log

        make build changelog
7. [Upload](https://addons.mozilla.org/en-US/developers/addon/insecure-links-highlighter/versions/submit/) the new .xpi
8. Submit the change log markup

## [License](LICENSE)

GNU GPL version 3 or later.
