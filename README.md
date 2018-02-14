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


## [License](LICENSE)

GNU GPL version 3 or later.
