[].forEach.call(
    document.getElementsByTagName("a"),
    function (element) {
        var href = element.getAttribute("href");
        if (href && href.substring(0, 7) === "http://") {
            element.style.border = "5px solid red";
        }
    }
);
