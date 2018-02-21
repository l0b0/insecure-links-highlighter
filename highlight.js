/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function (exports) {
    'use strict';

    let protocolPrefixRegex = new RegExp('^[a-z]+://', 'i');

    // Known secure protocols handled by the browser
    let internalSecureProtocols = ['https'];

    // Presumed secure since they are handled externally (see network.protocol-handler.external.[protocol])
    let externallyHandledProtocols = ['mailto', 'news', 'nntp', 'snews'];

    // Presumed secure, commonly handled by add-ons or externally
    let expectedExternallyHandledProtocols = ['tel'];

    let secureProtocols = [].concat(
        internalSecureProtocols,
        externallyHandledProtocols,
        expectedExternallyHandledProtocols
    );

    if (typeof document !== 'undefined') {
        exports.protocol = location.protocol;

        if (typeof browser !== 'undefined') {
            browser.storage.local.get().then(onConfigurationRetrieved, onError);
        } else {
            exports.configuration = defaultOptions;
            processAndObserveDocument();
        }
    }

    function onConfigurationRetrieved(items) {
        exports.configuration = Object.assign({}, defaultOptions, items);
        processAndObserveDocument();
    }

    function processAndObserveDocument() {
        processNode(document);

        let observer = new MutationObserver(onMutation);
        observer.observe(document, {'attributes': true, 'childList': true, 'subtree': true});
    }

    function onMutation(mutationRecords) {
        mutationRecords.forEach(processMutationRecord);
    }

    function processMutationRecord(mutationRecord) {
        if (mutationRecord.type === 'childList') {
            mutationRecord.addedNodes.forEach(processMutationNode);
        } else if (mutationRecord.type === 'attributes' && mutationRecord.attributeName === 'href') {
            highlightInsecureLink(mutationRecord.target);
        }
    }

    function processMutationNode(node) {
        if (node instanceof Element) {
            processNode(node.parentElement);
        }
    }

    function processNode(node) {
        [].forEach.call(
            getLinks(node),
            highlightInsecureLink
        );
    }

    function getLinks(node) {
        return node.getElementsByTagName('a');
    }

    function highlightInsecureLink(element) {
        if (isInsecureLink(element)) {
            highlight(element);
        }
    }

    function isInsecureLink(element) {
        return element.hasAttribute('href') && !isSecureURL(element.getAttribute('href'), exports.protocol);
    }

    function isSecureURL(url, protocol) {
        url = url.toLowerCase();
        let urlProtocol = url.split(':', 1)[0];

        if (secureProtocols.includes(urlProtocol)) {
            return true;
        }

        return !hasExplicitProtocol(url) && (protocol === 'file:' || protocol === 'https:');
    }

    function hasExplicitProtocol(url) {
        return protocolPrefixRegex.test(url);
    }

    function highlight(element) {
        if (element.style.cssText !== '') {
            element.style.cssText += '; ';
        }

        element.style.cssText += `border-color: ${exports.configuration.borderColor} !important; border-style: solid !important;`;
    }

    function onError(error) {
        throw error;
    }

    exports.hasExplicitProtocol = hasExplicitProtocol;
    exports.isInsecureLink = isInsecureLink;
    exports.isSecureURL = isSecureURL;
    exports.highlight = highlight;
}(this));
