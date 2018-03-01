/*global beforeEach, describe, it, require*/

const assert = require('assert'),
    defaultOptions = require('../../defaultOptions').defaultOptions,
    highlight = require('../../highlight'),
    {JSDOM} = require('jsdom');

describe('highlight', function () {
    'use strict';

    beforeEach(function () {
        highlight.configuration = defaultOptions;
    });

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

        it('should consider links with @onclick as insecure by default', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            element.onclick = function() {};
            assert.ok(highlight.isInsecureLink(element));
        });

        it('should consider links with @onclick as secure if configured as such', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            element.onclick = function() {};
            highlight.configuration = Object.assign({}, defaultOptions, {elementsWithEventHandlersAreInsecure: false});
            assert.ok(!highlight.isInsecureLink(element));
        });
    });

    describe(highlight.highlight.name, function () {
        it('should add a class to the element', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            highlight.configuration = defaultOptions;
            highlight.highlight(element);
            assert.ok(element.classList.contains(highlight.configuration.class));
        });

        it('should set the style of the element', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            highlight.configuration = defaultOptions;
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

    describe(highlight.commonAncestor.name, function () {
        it('should return the parent of two sibling elements', function () {
            const document = (new JSDOM()).window.document;

            const parent = document.createElement('parent');

            const firstChild = document.createElement('child');
            const secondChild = document.createElement('child');

            parent.appendChild(firstChild);
            parent.appendChild(secondChild);

            assert.equal(parent, highlight.commonAncestor([firstChild, secondChild]));
        });

        it('should return the parent from a parent and child', function () {
            const document = (new JSDOM()).window.document;

            const parent = document.createElement('parent');

            const child = document.createElement('child');

            parent.appendChild(child);

            assert.equal(parent, highlight.commonAncestor([parent, child]));
        });
    });

    describe(highlight.ancestors.name, function () {
        it('should return the element if it has no parent', function () {
            const document = (new JSDOM()).window.document;

            const element = document.createElement('element');

            assert.deepEqual([element], highlight.ancestors(element));
        });

        it('should return the parent and the element, oldest first', function () {
            const document = (new JSDOM()).window.document;

            const parent = document.createElement('parent');

            const firstChild = document.createElement('child');
            const secondChild = document.createElement('child');

            parent.appendChild(firstChild);
            parent.appendChild(secondChild);

            assert.deepEqual([parent, firstChild], highlight.ancestors(firstChild));
        });
    });
});
