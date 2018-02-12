/*global describe, it, require*/

var assert = require("assert"),
    highlight = require("../highlight");

describe("highlight", function() {
    "use strict";

    describe(highlight.isSecure.name, function() {
        it("should return true for an HTTPS URL", function() {
            assert.ok(highlight.isSecure("https://example.org"));
        });
        it("should return false for an HTTP URL", function() {
            assert.ok(!highlight.isSecure("http://example.org"));
        });
        it("should return false for an FPT URL", function() {
            assert.ok(!highlight.isSecure("ftp://example.org"));
        });
    });

    describe(highlight.highlight.name, function() {
        it("should set the style of the element", function() {
            var element = {"style": {}};
            highlight.highlight(element);
            assert.equal(element.style.border, "5px solid red");
        });
    });
});
