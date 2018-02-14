#!/bin/sh

set -o errexit -o nounset

github_changelog_generator --no-verbose --output /tmp/CHANGELOG.md --project insecure-links-highlighter --user l0b0 >&2
markdown /tmp/CHANGELOG.md
