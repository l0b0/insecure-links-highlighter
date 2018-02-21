/*global describe, it, require, xit*/

const assert = require('assert'),
    highlight = require('../../highlight'),
    {JSDOM} = require('jsdom');

describe('highlight', function () {
    'use strict';

    describe(highlight.isSecureURL.name, function () {
        it('should return true for an HTTPS URL on an HTTPS page', function () {
            assert.ok(highlight.isSecureURL('https://example.org', 'https:'));
        });
        it('should return true for an HTTPS URL in a local file', function () {
            assert.ok(highlight.isSecureURL('https://example.org', 'file:'));
        });
        it('should return true for an HTTPS URL on an insecure page', function () {
            assert.ok(highlight.isSecureURL('https://example.org', 'http:'));
        });
        it('should return true for an uppercase HTTPS URL on an HTTPS page', function () {
            assert.ok(highlight.isSecureURL('HTTPS://EXAMPLE.ORG', 'https:'));
        });

        it('should return false for an HTTP URL', function () {
            assert.ok(!highlight.isSecureURL('http://example.org', 'https:'));
        });

        it('should return false for an FPT URL', function () {
            assert.ok(!highlight.isSecureURL('ftp://example.org', 'https:'));
        });

        it('should return true for a relative URL on an HTTPS page', function () {
            assert.ok(highlight.isSecureURL('example.html', 'https:'));
        });
        it('should return true for a relative URL in a local file', function () {
            assert.ok(highlight.isSecureURL('example.html', 'file:'));
        });
        it('should return false for a relative URL on an HTTP page', function () {
            assert.ok(!highlight.isSecureURL('example.html', 'http:'));
        });

        it('should return true for a protocol-relative URL on an HTTPS page', function () {
            assert.ok(highlight.isSecureURL('//example.html', 'https:'));
        });
        it('should return true for a protocol-relative URL in a local file', function () {
            assert.ok(highlight.isSecureURL('//example.html', 'file:'));
        });
        it('should return false for a protocol-relative URL on an HTTP page', function () {
            assert.ok(!highlight.isSecureURL('//example.html', 'http:'));
        });

        it('should return true for a mailto URL', function () {
            assert.ok(highlight.isSecureURL('mailto:user@example.org', 'http:'));
        });
        it('should return true for a news URL', function () {
            assert.ok(highlight.isSecureURL('news:example.org/group', 'http:'));
        });
        it('should return true for an NNTP URL', function () {
            assert.ok(highlight.isSecureURL('nntp:example.org/group', 'http:'));
        });
        it('should return true for an snews URL', function () {
            assert.ok(highlight.isSecureURL('snews:example.org/group', 'http:'));
        });

        it('should return true for a tel URL', function () {
            assert.ok(highlight.isSecureURL('tel:+0000000000', 'http:'));
        });
    });

    describe(highlight.isInsecureLink.name, function () {
        it('should consider links without @href as secure', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            assert.ok(!highlight.isInsecureLink(element));
        });

        xit('should consider links with @onclick as insecure', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            element.onclick = 'location="http://example.org"';
            assert.ok(highlight.isInsecureLink(element));
        });
    });

    describe(highlight.highlight.name, function () {
        it('should set the style of the element', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            highlight.configuration = {
                'borderColor': 'red'
            };
            highlight.highlight(element);
            assert.equal(element.style.cssText, 'border-color: red !important; border-style: solid !important;');
        });
    });

    describe(highlight.hasExplicitProtocol.name, function () {
        it('should consider "http://…" URLs as absolute', function () {
            assert.ok(highlight.hasExplicitProtocol('http://example.org'));
        });

        it('should consider "HTTP://…" URLs as absolute', function () {
            assert.ok(highlight.hasExplicitProtocol('HTTP://example.org'));
        });

        it('should consider "//…" URLs as relative', function () {
            assert.ok(!highlight.hasExplicitProtocol('//example.org'));
        });

        it('should consider "/PATH" URLs as relative', function () {
            assert.ok(!highlight.hasExplicitProtocol('/example.html'));
        });

        it('should consider "PATH" URLs as relative', function () {
            assert.ok(!highlight.hasExplicitProtocol('example.html'));
        });
    });
});
