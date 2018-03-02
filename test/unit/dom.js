/*global describe, it, require*/

const assert = require('assert'),
    defaultOptions = require('../../defaultOptions').defaultOptions,
    dom = require('../../dom'),
    {JSDOM} = require('jsdom');

global.Node = (new JSDOM()).window.Node;

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
            const document = (new JSDOM()).window.document,
                parent = document.createElement('parent'),
                firstChild = document.createElement('child'),
                secondChild = document.createElement('child');

            parent.appendChild(firstChild);
            parent.appendChild(secondChild);

            assert.equal(dom.commonAncestor([firstChild, secondChild]), parent);
        });

        it('should return the parent from a parent and child', function () {
            const document = (new JSDOM()).window.document,
                parent = document.createElement('parent'),
                child = document.createElement('child');

            parent.appendChild(child);

            assert.equal(dom.commonAncestor([parent, child]), parent);
        });
    });

    describe(dom.ancestors.name, function () {
        it('should return the element if it has no parent', function () {
            const document = (new JSDOM()).window.document,
                element = document.createElement('element');

            assert.deepStrictEqual(dom.ancestors(element), [element]);
        });

        it('should return the parent and the element, oldest first', function () {
            const document = (new JSDOM()).window.document,
                parent = document.createElement('parent'),
                firstChild = document.createElement('child'),
                secondChild = document.createElement('child');

            parent.appendChild(firstChild);
            parent.appendChild(secondChild);

            assert.deepStrictEqual(dom.ancestors(firstChild), [parent, firstChild]);
        });
    });

    describe(dom.getLinks.name, function () {
        it('should return direct child link', function () {
            const document = (new JSDOM()).window.document,
                parent = document.createElement('parent'),
                link = document.createElement('a');
            parent.appendChild(link);

            assert.deepStrictEqual(dom.getLinks(parent), [link]);
        });
        it('should return direct multiple descendant link', function () {
            const document = (new JSDOM()).window.document,
                grandparent = document.createElement('grandparent'),
                parent = document.createElement('parent'),
                link = document.createElement('a');
            parent.appendChild(link);
            grandparent.appendChild(parent);

            assert.deepStrictEqual(dom.getLinks(grandparent), [link]);
        });
        it('should return multiple links at multiple levels', function () {
            const document = (new JSDOM()).window.document,
                grandparent = document.createElement('grandparent'),
                childLink = document.createElement('a'),
                parent = document.createElement('parent'),
                grandchildLink = document.createElement('a');
            parent.appendChild(grandchildLink);
            grandparent.appendChild(parent);
            grandparent.appendChild(childLink);

            assert.deepStrictEqual(dom.getLinks(grandparent), [grandchildLink, childLink]);
        });
    });

    describe(dom.isElement.name, function () {
        it('should return true for an element', function () {
            const element = (new JSDOM()).window.document.createElement('name');
            assert.ok(dom.isElement(element));
        });
        it('should return false for an attribute', function () {
            const element = (new JSDOM()).window.document.createAttribute('name');
            assert.ok(!dom.isElement(element));
        });
    });
});
