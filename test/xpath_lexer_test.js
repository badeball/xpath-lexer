"use strict";

var Assert = require("assert");

var XPathLexer = require("./../lib/xpath_lexer");

function itShouldNotTokenize (expression, errorPosition) {
  it("should throw upon  " + expression, function () {
    Assert.throws(function () {
      new XPathLexer(expression);
    }, new RegExp("Invalid character at position " + errorPosition));
  });
}

function itShouldTokenize (expression) {
  it("should tokenize " + expression, function () {
    var lexer = new XPathLexer(expression);

    Assert.deepEqual(lexer.next(), expression);
  });
}

var exampleExpression = "//foo:bar::children*[@id='baz']";

var exampleTokens = [
  "\/\/",
  "foo:bar",
  "::",
  "children",
  "*",
  "[",
  "@",
  "id",
  "=",
  "'baz'",
  "]"
];

describe("XPathLexer", function () {
  describe("length()", function () {
    it("should return the number of tokens", function () {
      var lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.length(), exampleTokens.length);
    });
  });

  describe("next()", function () {
    it("should always return the next token", function () {
      var lexer = new XPathLexer(exampleExpression);

      for (var i = 0; i < lexer.length(); i++) {
        Assert.equal(lexer.next(), exampleTokens[i]);
      }
    });
  });

  describe("back()", function () {
    it("should move the lexer backwards once", function () {
      var lexer = new XPathLexer(exampleExpression);

      lexer.next();
      lexer.back();

      Assert.equal(lexer.next(), exampleTokens[0]);
    });
  });

  describe("peak()", function () {
    it("should return the Nth next token without moving forwards", function () {
      var lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.peak(1), exampleTokens[1]);
      Assert.equal(lexer.peak(), exampleTokens[0]);
    });
  });

  describe("empty()", function () {
    it("should return false when the tokens has not been traversed", function () {
      var lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.empty(), false);
    });

    it("should return true when the tokens has been traversed", function () {
      var lexer = new XPathLexer(exampleExpression);

      for (var i = 0; i < lexer.length(); i++) {
        lexer.next();
      }

      Assert.equal(lexer.empty(), true);
    });
  });

  describe("static tokenize()", function () {
    itShouldNotTokenize("%", 0);
    itShouldNotTokenize("//foo[%bar='baz']", 6);

    itShouldTokenize("$foo");
    itShouldTokenize("foo");
    itShouldTokenize("foo:bar");
    itShouldTokenize("and");
    itShouldTokenize("or");
    itShouldTokenize("mod");
    itShouldTokenize("div");
    itShouldTokenize("comment");
    itShouldTokenize("text");
    itShouldTokenize("processing-instruction");
    itShouldTokenize("node");
    itShouldTokenize("1");
    itShouldTokenize("1.0");
    itShouldTokenize(".0");
    itShouldTokenize("/");
    itShouldTokenize("//");
    itShouldTokenize(".");
    itShouldTokenize("..");
    itShouldTokenize("::");
    itShouldTokenize(",");
    itShouldTokenize("@");
    itShouldTokenize("*");
    itShouldTokenize("-");
    itShouldTokenize("+");
    itShouldTokenize("=");
    itShouldTokenize("!=");
    itShouldTokenize("<");
    itShouldTokenize("<=");
    itShouldTokenize(">");
    itShouldTokenize(">=");
    itShouldTokenize("|");
    itShouldTokenize("(");
    itShouldTokenize(")");
    itShouldTokenize("[");
    itShouldTokenize("]");
    itShouldTokenize("\"foo\"");
    itShouldTokenize("'foo'");
    itShouldTokenize("''");

    it("should tokenize even when containing whitespace", function () {
      var lexer = new XPathLexer(" / ");

      Assert.deepEqual(lexer.next(), "/");
    });
  });
});
