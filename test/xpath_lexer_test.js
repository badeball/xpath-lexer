"use strict";

var Assert = require("assert");

var XPathLexer = require("./../lib/xpath_lexer");

function itShouldTokenize (expression) {
  it("should tokenize " + expression, function () {
    var actual = XPathLexer.tokenize(expression);

    var expected = [expression];

    Assert.deepEqual(actual, expected);
  });
}

var exampleExpression = "//foo:bar::children*[@id='baz']";

describe("XPathLexer", function () {
  describe("next()", function () {
    it("should always return the next token", function () {
      var tokens = XPathLexer.tokenize(exampleExpression),
          lexer = new XPathLexer(exampleExpression);

      for (var i = 0; i < tokens.length; i++) {
        Assert.equal(lexer.next(), tokens[i]);
      }
    });
  });

  describe("back()", function () {
    it("should move the lexer backwards once", function () {
      var tokens = XPathLexer.tokenize(exampleExpression),
          lexer = new XPathLexer(exampleExpression);

      lexer.next();
      lexer.back();

      Assert.equal(lexer.next(), tokens[0]);
    });
  });

  describe("peak()", function () {
    it("should return the Nth next token without moving forwards", function () {
      var tokens = XPathLexer.tokenize(exampleExpression),
          lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.peak(1), tokens[1]);
      Assert.equal(lexer.next(), tokens[0]);
    });
  });

  describe("empty()", function () {
    it("should return false when the tokens has not been traversed", function () {
      var lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.empty(), false);
    });

    it("should return true when the tokens has been traversed", function () {
      var tokens = XPathLexer.tokenize(exampleExpression),
          lexer = new XPathLexer(exampleExpression);

      for (var i = 0; i < tokens.length; i++) {
        lexer.next();
      }

      Assert.equal(lexer.empty(), true);
    });
  });

  describe("static tokenize()", function () {
    it("should throw upon an invalid expression", function () {
      Assert.throws(function () {
        XPathLexer.tokenize("//foo[%bar='baz']");
      }, /Invalid XPath expression/);
    });

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
      var actual = XPathLexer.tokenize(" / ");

      var expected = ["/"];

      Assert.deepEqual(actual, expected);
    });
  });
});
