/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function (exports) {
    "use strict";

    var protocolPrefixRegex = new RegExp("^[a-z]+://", "i");

    if (typeof document !== "undefined") {
        exports.protocol = location.protocol;
        processNode(document);
        var observer = new MutationObserver(onMutation);
        observer.observe(document, {"childList": true, "subtree": true});
    }

    function onMutation(mutationRecords) {
        mutationRecords.forEach(processMutationRecord);
    }

    function processMutationRecord(mutationRecord) {
        mutationRecord.addedNodes.forEach(processMutationNode);
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
        return node.getElementsByTagName("a");
    }

    function highlightInsecureLink(element) {
        if (!isSecureLink(element)) {
            highlight(element);
        }
    }

    function isSecureLink(element) {
        return !element.hasAttribute("href") || isSecureURL(element.getAttribute("href"), exports.protocol);
    }

    function isSecureURL(url, protocol) {
        url = url.toLowerCase();
        if (url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
            return true;
        }
        return !hasExplicitProtocol(url) && (protocol === "file:" || protocol === "https:");
    }

    function hasExplicitProtocol(url) {
        return protocolPrefixRegex.test(url);
    }

    function highlight(element) {
        if (element.style.cssText !== "") {
            element.style.cssText += "; ";
        }
        element.style.cssText += "border-color: red !important; border-style: solid !important;";
    }

    exports.hasExplicitProtocol = hasExplicitProtocol;
    exports.isSecureLink = isSecureLink;
    exports.isSecureURL = isSecureURL;
    exports.highlight = highlight;
}(this));
