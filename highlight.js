/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global commonAncestor, getLinks, hasInsecureHrefAttribute, hasNonDefaultEventHandler, highlight, isElement*/
(function (exports) {
    'use strict';

    function onConfigurationRetrieved(items) {
        exports.configuration = items;
        processAndObserveDocument();
    }

    function processAndObserveDocument() {
        const attributeObserver = new MutationObserver(onAttributeMutation),
            elementObserver = new MutationObserver(onElementMutation);

        processNode(document);

        attributeObserver.observe(document.body, {'attributes': true, 'subtree': true});
        elementObserver.observe(document.body, {'childList': true, 'subtree': true});
    }

    function onAttributeMutation(mutationRecords) {
        mutationRecords.forEach(processAttributeMutationRecord);
    }

    function processAttributeMutationRecord(mutationRecord) {
        if (mutationRecord.attributeName === 'href') {
            highlightInsecureLink(mutationRecord.target);
        }
    }

    function onElementMutation(mutationRecords) {
        const addedElementsList = mutationRecords.map(mutationRecordElements),
            addedElements = [].concat.apply([], addedElementsList);

        processNode(commonAncestor(addedElements));
    }

    function mutationRecordElements(mutationRecord) {
        return Array.from(mutationRecord.addedNodes).filter(isElement);
    }

    function processNode(node) {
        getLinks(node).forEach(highlightInsecureLink);
    }

    function highlightInsecureLink(element) {
        if (
            hasInsecureHrefAttribute(element) ||
            (exports.configuration.elementsWithEventHandlersAreInsecure && hasNonDefaultEventHandler(element))
        ) {
            highlight(element, exports.configuration);
        }
    }

    exports.protocol = location.protocol;

    browser.storage.local.get(defaultOptions).then(onConfigurationRetrieved);
}(this));
