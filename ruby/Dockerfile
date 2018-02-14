# Build
FROM ruby:2.5.0-alpine3.7

WORKDIR /usr/local/bundle
RUN gem install github_changelog_generator --version 1.14.3

# Run
FROM ruby:2.5.0-alpine3.7

RUN apk --no-cache add markdown

COPY --from=0 /usr/local/bundle /usr/local/bundle

COPY ruby/changelog.sh /
