/*global describe, it, require*/

var assert = require("assert"),
    highlight = require("../highlight");

describe("highlight", function() {
    "use strict";

    describe("isSecure", function() {
        it("should return true for an HTTPS URL", function() {
            assert.ok(highlight.isSecure("https://example.org"));
        });
    });
});
