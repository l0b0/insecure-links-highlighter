(function (exports) {
    "use strict";

    function isSecure(url) {
        return url.substring(0, 7) !== "http://";
    }

    if (typeof document !== "undefined") {
        [].forEach.call(
            document.getElementsByTagName("a"),
            function (element) {
                var url = element.getAttribute("href");
                if (!isSecure(url)) {
                    element.style.border = "5px solid red";
                }
            }
        );
    }

    exports.isSecure = isSecure;
}(this));
