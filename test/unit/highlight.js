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
