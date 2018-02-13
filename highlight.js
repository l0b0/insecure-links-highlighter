/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function (exports) {
    "use strict";

    if (typeof document !== "undefined") {
        processDocument(document);
    }

    function processDocument(document) {
        [].forEach.call(
            getLinks(document),
            highlightInsecureLinks
        );
    }

    function getLinks(document) {
        return document.getElementsByTagName("a");
    }

    function highlightInsecureLinks(element) {
        if (!isSecureLink(element)) {
            highlight(element);
        }
    }

    function isSecureLink(element) {
        return isSecure(element.getAttribute("href"));
    }

    function isSecure(url) {
        return !(url.startsWith("http://") || url.startsWith("ftp://"));
    }

    function highlight(element) {
        element.style.borderColor = "red";
        element.style.borderStyle = "solid";
    }

    exports.isSecure = isSecure;
    exports.highlight = highlight;
}(this));
