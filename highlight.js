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
        [].forEach.call(
            getIframeDocuments(document),
            processDocument
        );
    }

    function getIframeDocuments(document) {
        var documents = [];

        [].forEach.call(
            document.getElementsByTagName("iframe"),
            function (iframe) {
                documents.push(iframe.contentDocument);
            }
        );
        return documents;
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
