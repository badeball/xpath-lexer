"use strict";

var lexer = new RegExp([
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
].join("|"), "g");

function XPathLexer (expression) {
  var match = expression.match(lexer);

  if (match === null) {
    throw new Error("Invalid character at position 0");
  }

  if (match.join("") !== expression) {
    var position = 0;

    while (expression.indexOf(match[0]) === position) {
      position += match.shift().length;
    }

    throw new Error("Invalid character at position " + position);
  }

  this.tokens = match.map(function (token) {
    return {
      value: token,
      position: 0
    };
  });

  this.tokens.reduce(function (previousToken, nextToken) {
    nextToken.position = previousToken.position + previousToken.value.length;
    return nextToken;
  });

  this.tokens = this.tokens.filter(function (token) {
    return !/^\s+$/.test(token.value);
  });

  this.index = 0;
}

XPathLexer.prototype.length = function () {
  return this.tokens.length;
};

XPathLexer.prototype.next = function () {
  var token = this.tokens[this.index++];

  return token && token.value;
};

XPathLexer.prototype.back = function () {
  this.index--;
};

XPathLexer.prototype.peak = function (n) {
  var token = this.tokens[this.index + (n || 0)];

  return token && token.value;
};

XPathLexer.prototype.empty = function () {
  return this.tokens.length <= this.index;
};

XPathLexer.prototype.position = function () {
  return this.tokens[this.index].position;
};

module.exports = XPathLexer;
