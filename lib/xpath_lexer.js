"use strict";

function XPathLexer (expression) {
  this.tokens = XPathLexer.tokenize(expression);
  this.index = 0;
}

XPathLexer.prototype.next = function () {
  return this.tokens[this.index++];
};

XPathLexer.prototype.back = function () {
  this.index--;
};

XPathLexer.prototype.peak = function (n) {
  return this.tokens[this.index + (n || 0)];
};

XPathLexer.prototype.empty = function () {
  return this.tokens.length <= this.index;
};

XPathLexer.tokenize = function (expression) {
  var match = expression.match(new RegExp([
    "\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+",
    "\\d+\\.\\d+",
    "\\.\\d+",
    "\\d+",
    "\\/\\/",
    "\/",
    "\\.\\.",
    "\\.",
    "\\s+",
    "::",
    ",",
    "@",
    "-",
    "=",
    "!=",
    "<=",
    "<",
    ">=",
    ">",
    "\\|",
    "\\+",
    "\\*",
    "\\(",
    "\\)",
    "\\[",
    "\\]",
    "\"[^\"]*\"",
    "'[^']*'"
  ].join("|"), "g"));

  if (!match || match.join("") !== expression) {
    throw new Error("Invalid XPath expression");
  }

  return match.filter(function (token) {
    return !/^\s+$/.test(token);
  });
};

module.exports = XPathLexer;
