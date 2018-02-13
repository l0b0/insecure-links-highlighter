/*global describe, it, require*/

var assert = require("assert"),
    highlight = require("../../highlight");

describe("highlight", function() {
    "use strict";

    describe(highlight.isSecure.name, function() {
        it("should return true for an HTTPS URL on an HTTPS page", function() {
            assert.ok(highlight.isSecure("https://example.org", "https:"));
        });
        it("should return true for an HTTPS URL in a local file", function() {
            assert.ok(highlight.isSecure("https://example.org", "file:"));
        });
        it("should return true for an HTTPS URL on an insecure page", function() {
            assert.ok(highlight.isSecure("https://example.org", "http:"));
        });

        it("should return false for an HTTP URL", function() {
            assert.ok(!highlight.isSecure("http://example.org", "https:"));
        });

        it("should return false for an FPT URL", function() {
            assert.ok(!highlight.isSecure("ftp://example.org", "https:"));
        });

        it("should return true for a relative URL on an HTTPS page", function() {
            assert.ok(highlight.isSecure("example.html", "https:"));
        });
        it("should return true for a relative URL in a local file", function() {
            assert.ok(highlight.isSecure("example.html", "file:"));
        });
        it("should return false for a relative URL on an HTTP page", function() {
            assert.ok(!highlight.isSecure("example.html", "http:"));
        });
    });

    describe(highlight.highlight.name, function() {
        it("should set the style of the element", function() {
            var element = {"style": {}};
            highlight.highlight(element);
            assert.equal(element.style.borderColor, "red");
            assert.equal(element.style.borderStyle, "solid");
        });
    });

    describe(highlight.isAbsoluteURL.name, function() {
        it("should consider 'http://…' URLs as absolute", function() {
            assert.ok(highlight.isAbsoluteURL("http://example.org"));
            assert.ok(highlight.isAbsoluteURL("HTTP://example.org"));
        });
        it("should consider '//…' URLs as absolute", function() {
            assert.ok(highlight.isAbsoluteURL("//example.org"));
        });
        it("should consider '/PATH' URLs as relative", function() {
            assert.ok(!highlight.isAbsoluteURL("/example.html"));
        });
        it("should consider 'PATH' URLs as relative", function() {
            assert.ok(!highlight.isAbsoluteURL("example.html"));
        });
    });
});
