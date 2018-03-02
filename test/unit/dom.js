/*global describe, it, require*/

const assert = require('assert'),
    defaultOptions = require('../../defaultOptions').defaultOptions,
    dom = require('../../dom'),
    {JSDOM} = require('jsdom');

describe('dom', function () {
    'use strict';

    describe(dom.isInsecureLink.name, function () {
        it('should consider links without @href as secure', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            assert.ok(!dom.isInsecureLink(element, defaultOptions));
        });

        it('should consider links with @onclick as insecure by default', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            element.onclick = function() {};
            assert.ok(dom.isInsecureLink(element, defaultOptions));
        });

        it('should consider links with @onclick as secure if configured as such', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            element.onclick = function() {};
            assert.ok(!dom.isInsecureLink(element, Object.assign({}, defaultOptions, {elementsWithEventHandlersAreInsecure: false})));
        });
    });

    describe(dom.highlight.name, function () {
        it('should add a class to the element', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            dom.highlight(element, defaultOptions);
            assert.ok(element.classList.contains(defaultOptions.class));
        });

        it('should set the style of the element', function () {
            const element = (new JSDOM()).window.document.createElement('a');
            dom.highlight(element, defaultOptions);
            assert.equal(element.style.cssText, 'border-color: red !important; border-style: solid !important;');
        });
    });

    describe(dom.commonAncestor.name, function () {
        it('should return the parent of two sibling elements', function () {
            const document = (new JSDOM()).window.document;

            const parent = document.createElement('parent');

            const firstChild = document.createElement('child');
            const secondChild = document.createElement('child');

            parent.appendChild(firstChild);
            parent.appendChild(secondChild);

            assert.equal(parent, dom.commonAncestor([firstChild, secondChild]));
        });

        it('should return the parent from a parent and child', function () {
            const document = (new JSDOM()).window.document;

            const parent = document.createElement('parent');

            const child = document.createElement('child');

            parent.appendChild(child);

            assert.equal(parent, dom.commonAncestor([parent, child]));
        });
    });

    describe(dom.ancestors.name, function () {
        it('should return the element if it has no parent', function () {
            const document = (new JSDOM()).window.document;

            const element = document.createElement('element');

            assert.deepEqual([element], dom.ancestors(element));
        });

        it('should return the parent and the element, oldest first', function () {
            const document = (new JSDOM()).window.document;

            const parent = document.createElement('parent');

            const firstChild = document.createElement('child');
            const secondChild = document.createElement('child');

            parent.appendChild(firstChild);
            parent.appendChild(secondChild);

            assert.deepEqual([parent, firstChild], dom.ancestors(firstChild));
        });
    });
});
