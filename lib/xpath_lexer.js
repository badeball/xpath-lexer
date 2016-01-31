"use strict";

function XPathLexer (expression) {
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

  this.tokens = match.filter(function (token) {
    return !/^\s+$/.test(token);
  });

  this.index = 0;
}

XPathLexer.prototype.length = function () {
  return this.tokens.length;
};

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

XPathLexer.prototype.position = function () {
  var position = 0;

  for (var i = 0; i < this.index; i++) {
    position += this.tokens[i].length;
  }

  return position;
};

module.exports = XPathLexer;
