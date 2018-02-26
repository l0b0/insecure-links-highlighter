/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function (exports) {
    'use strict';

    const protocolPrefixRegex = new RegExp('^[a-z]+://'),

        // Known secure protocols handled by the browser
        internalSecureProtocols = ['https'],

        // Presumed secure since they are handled externally (see network.protocol-handler.external.[protocol])
        externallyHandledProtocols = ['mailto', 'news', 'nntp', 'snews'],

        // Presumed secure, commonly handled by add-ons or externally
        expectedExternallyHandledProtocols = ['tel'],

        secureProtocols = [].concat(
            internalSecureProtocols,
            externallyHandledProtocols,
            expectedExternallyHandledProtocols
        ),

        eventHandlerAttributes = [
            'onabort',
            // 'onafterprint',
            // 'onauxclick',
            // 'onbeforeprint',
            // 'onbeforeunload',
            'onblur',
            // 'oncancel',
            'oncanplay',
            'oncanplaythrough',
            'onchange',
            'onclick',
            'onclose',
            'oncontextmenu',
            // 'oncopy',
            // 'oncuechange',
            'oncut',
            'ondblclick',
            'ondrag',
            'ondragend',
            'ondragenter',
            'ondragexit',
            'ondragleave',
            'ondragover',
            'ondragstart',
            'ondrop',
            'ondurationchange',
            'onemptied',
            'onended',
            'onerror',
            'onfocus',
            // 'onhashchange',
            'oninput',
            'oninvalid',
            'onkeydown',
            'onkeypress',
            'onkeyup',
            // 'onlanguagechange',
            'onload',
            'onloadeddata',
            'onloadedmetadata',
            'onloadend',
            'onloadstart',
            // 'onmessage',
            // 'onmessageerror',
            'onmousedown',
            'onmouseenter',
            'onmouseleave',
            'onmousemove',
            'onmouseout',
            'onmouseover',
            'onmouseup',
            // 'onoffline',
            // 'ononline',
            // 'onpagehide',
            // 'onpageshow',
            'onpaste',
            'onpause',
            'onplay',
            'onplaying',
            // 'onpopstate',
            'onprogress',
            'onratechange',
            // 'onrejectionhandled',
            'onreset',
            'onresize',
            'onscroll',
            // 'onsecuritypolicyviolation',
            'onseeked',
            'onseeking',
            'onselect',
            'onstalled',
            // 'onstorage',
            'onsubmit',
            'onsuspend',
            'ontimeupdate',
            'ontoggle',
            // 'onunhandledrejection',
            // 'onunload',
            'onvolumechange',
            'onwaiting',
            'onwheel',
        ];

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
        const addedElementsList = mutationRecords.map(mutationRecordElements);
        const addedElements = [].concat.apply([], addedElementsList);

        processNode(commonAncestor(addedElements));
    }

    function mutationRecordElements(mutationRecord) {
        return Array.from(mutationRecord.addedNodes).filter(isElement);
    }

    function isElement(node) {
        return node instanceof Element;
    }

    function commonAncestor(elements) {
        const ancestorLists = elements.map(ancestors);
        let commonAncestorIndex = 0,
            commonAncestor;

        function hasNextAncestor(ancestors) {
            return ancestors[commonAncestorIndex + 1] === commonAncestor;
        }

        do {
            commonAncestor = ancestorLists[0][commonAncestorIndex];
            commonAncestorIndex++;
        } while (ancestorLists.every(hasNextAncestor));

        return commonAncestor;
    }

    function ancestors(element) {
        let ancestors = [element];
        while (element.parentElement !== null) {
            let parent = element.parentElement;
            ancestors.unshift(parent);
            element = parent;
        }
        return ancestors;
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
        function hasEventHandler(handlerAttribute) {
            const attribute = element[handlerAttribute];
            return attribute !== undefined && attribute !== null;
        }

        if (exports.configuration.elementsWithEventHandlersAreInsecure && eventHandlerAttributes.some(hasEventHandler)) {
            return true;
        }

        return element.hasAttribute('href') && !isSecureURL(element.getAttribute('href'), exports.protocol);
    }

    function isSecureURL(url, protocol) {
        const urlProtocol = url.split(':', 1)[0].toLowerCase();

        if (secureProtocols.includes(urlProtocol)) {
            return true;
        }

        return !hasExplicitProtocol(url) && (protocol === 'file:' || protocol === 'https:');
    }

    function hasExplicitProtocol(url) {
        return protocolPrefixRegex.test(url.toLowerCase());
    }

    function highlight(element) {
        if (element.style.cssText !== '') {
            element.style.cssText += '; ';
        }

        element.classList.add(exports.configuration.class);
        element.style.cssText += `border-color: ${exports.configuration.borderColor} !important; border-style: solid !important;`;
    }

    function onError(error) {
        throw error;
    }

    exports.ancestors = ancestors;
    exports.commonAncestor = commonAncestor;
    exports.hasExplicitProtocol = hasExplicitProtocol;
    exports.isInsecureLink = isInsecureLink;
    exports.isSecureURL = isSecureURL;
    exports.highlight = highlight;

    if (typeof document !== 'undefined') {
        exports.protocol = location.protocol;

        if (typeof browser !== 'undefined') {
            browser.storage.local.get(defaultOptions).then(onConfigurationRetrieved, onError);
        } else {
            exports.configuration = defaultOptions;
            processAndObserveDocument();
        }
    }
}(this));
