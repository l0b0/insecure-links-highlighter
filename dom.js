/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global isSecureURL*/
(function (exports) {
    'use strict';

    const eventHandlerAttributes = [
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

    function isInsecureLink(element, configuration) {
        function hasEventHandler(handlerAttribute) {
            const attribute = element[handlerAttribute];
            return attribute !== undefined && attribute !== null;
        }

        if (configuration.elementsWithEventHandlersAreInsecure && eventHandlerAttributes.some(hasEventHandler)) {
            return true;
        }

        return element.hasAttribute('href') && !isSecureURL(element.getAttribute('href'), exports.protocol);
    }

    function highlight(element, configuration) {
        if (element.style.cssText !== '') {
            element.style.cssText += '; ';
        }

        element.classList.add(configuration.class);
        element.style.cssText += `border-color: ${configuration.borderColor} !important; border-style: solid !important;`;
    }

    function isElement(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    }

    exports.ancestors = ancestors;
    exports.commonAncestor = commonAncestor;
    exports.highlight = highlight;
    exports.isElement = isElement;
    exports.isInsecureLink = isInsecureLink;
}(this));
