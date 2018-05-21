import Assert from "assert";

import XPathLexer from "./../lib/xpath_lexer";

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
  "//",
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

    it("should return null when no more tokens exist", function () {
      var lexer = new XPathLexer(exampleExpression);

      // Invoking next() as many times as there are tokens.
      for (var i = 0; i < lexer.length(); i++) {
        lexer.next();
      }

      Assert.equal(lexer.next(), null);
    });

    it("should not move further forward when reaching the last token", function () {
      var lexer = new XPathLexer(exampleExpression);

      // Invoking next() *twice* as many times as there are tokens.
      for (var i = 0; i < lexer.length() * 2; i++) {
        lexer.next();
      }

      lexer.back();

      Assert.equal(lexer.next(), exampleTokens[exampleTokens.length - 1]);
    });
  });

  describe("back()", function () {
    it("should move the lexer backwards once", function () {
      var lexer = new XPathLexer(exampleExpression);

      lexer.next();
      lexer.back();

      Assert.equal(lexer.next(), exampleTokens[0]);
    });

    it("should not move the lexer further back than the first token", function () {
      var lexer = new XPathLexer(exampleExpression);

      lexer.next();
      lexer.back();
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

    it("should return null when the token doesn't exist", function () {
      var lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.peak(10000), null);
    });
  });

  describe("empty()", function () {
    it("should return false when the tokens has not been traversed", function () {
      var lexer = new XPathLexer(exampleExpression);

      Assert.equal(lexer.empty(), false);
    });

    it("should return true when the tokens has been traversed", function () {
      var lexer = new XPathLexer(exampleExpression);

      // Invoking next() as many times as there are tokens.
      for (var i = 0; i < lexer.length(); i++) {
        lexer.next();
      }

      Assert.equal(lexer.empty(), true);
    });
  });

  describe("position()", function () {
    it("should return the position of the next token", function () {
      var lexer = new XPathLexer("//foo::bar");

      Assert.equal(lexer.next(), "//");
      Assert.equal(lexer.next(), "foo");
      Assert.equal(lexer.next(), "::");
      Assert.equal(lexer.peak(), "bar");

      Assert.equal(lexer.position(), 7);
    });

    it("should take whitespace into the account", function () {
      var lexer = new XPathLexer(" //foo :: bar");

      Assert.equal(lexer.position(), 1);

      Assert.equal(lexer.next(), "//");
      Assert.equal(lexer.next(), "foo");
      Assert.equal(lexer.next(), "::");
      Assert.equal(lexer.peak(), "bar");

      Assert.equal(lexer.position(), 10);
    });

    it("should return the length of the string when the lexer is empty", function () {
      var lexer = new XPathLexer("//foo::bar");

      Assert.equal(lexer.next(), "//");
      Assert.equal(lexer.next(), "foo");
      Assert.equal(lexer.next(), "::");
      Assert.equal(lexer.next(), "bar");

      Assert.equal(lexer.position(), 10);
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
