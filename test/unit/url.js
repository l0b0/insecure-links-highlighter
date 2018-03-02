/*global describe, it, require*/

const assert = require('assert'),
    url = require('../../url');

describe('url', function () {
    'use strict';

    describe(url.isSecureURL.name, function () {
        it('should return true for an HTTPS URL on an HTTPS page', function () {
            assert.ok(url.isSecureURL('https://example.org', 'https:'));
        });
        it('should return true for an HTTPS URL in a local file', function () {
            assert.ok(url.isSecureURL('https://example.org', 'file:'));
        });
        it('should return true for an HTTPS URL on an insecure page', function () {
            assert.ok(url.isSecureURL('https://example.org', 'http:'));
        });
        it('should return true for an uppercase HTTPS URL on an HTTPS page', function () {
            assert.ok(url.isSecureURL('HTTPS://EXAMPLE.ORG', 'https:'));
        });

        it('should return false for an HTTP URL', function () {
            assert.ok(!url.isSecureURL('http://example.org', 'https:'));
        });

        it('should return false for an FPT URL', function () {
            assert.ok(!url.isSecureURL('ftp://example.org', 'https:'));
        });

        it('should return true for a relative URL on an HTTPS page', function () {
            assert.ok(url.isSecureURL('example.html', 'https:'));
        });
        it('should return true for a relative URL in a local file', function () {
            assert.ok(url.isSecureURL('example.html', 'file:'));
        });
        it('should return false for a relative URL on an HTTP page', function () {
            assert.ok(!url.isSecureURL('example.html', 'http:'));
        });

        it('should return true for a protocol-relative URL on an HTTPS page', function () {
            assert.ok(url.isSecureURL('//example.html', 'https:'));
        });
        it('should return true for a protocol-relative URL in a local file', function () {
            assert.ok(url.isSecureURL('//example.html', 'file:'));
        });
        it('should return false for a protocol-relative URL on an HTTP page', function () {
            assert.ok(!url.isSecureURL('//example.html', 'http:'));
        });

        it('should return true for a mailto URL', function () {
            assert.ok(url.isSecureURL('mailto:user@example.org', 'http:'));
        });
        it('should return true for a news URL', function () {
            assert.ok(url.isSecureURL('news:example.org/group', 'http:'));
        });
        it('should return true for an NNTP URL', function () {
            assert.ok(url.isSecureURL('nntp:example.org/group', 'http:'));
        });
        it('should return true for an snews URL', function () {
            assert.ok(url.isSecureURL('snews:example.org/group', 'http:'));
        });

        it('should return true for a tel URL', function () {
            assert.ok(url.isSecureURL('tel:+0000000000', 'http:'));
        });
    });

    describe(url.hasExplicitProtocol.name, function () {
        it('should consider "http://…" URLs as absolute', function () {
            assert.ok(url.hasExplicitProtocol('http://example.org'));
        });

        it('should consider "HTTP://…" URLs as absolute', function () {
            assert.ok(url.hasExplicitProtocol('HTTP://example.org'));
        });

        it('should consider "//…" URLs as relative', function () {
            assert.ok(!url.hasExplicitProtocol('//example.org'));
        });

        it('should consider "/PATH" URLs as relative', function () {
            assert.ok(!url.hasExplicitProtocol('/example.html'));
        });

        it('should consider "PATH" URLs as relative', function () {
            assert.ok(!url.hasExplicitProtocol('example.html'));
        });
    });
});
