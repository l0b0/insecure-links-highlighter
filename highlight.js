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
        return url.substring(0, 7) !== "http://";
    }

    function highlight(element) {
        element.style.border = "5px solid red";
    }

    exports.isSecure = isSecure;
    exports.highlight = highlight;
}(this));
