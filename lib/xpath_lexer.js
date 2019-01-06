var lexer = new RegExp([
  "\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+",
  "\\d+\\.\\d+",
  "\\.\\d+",
  "\\d+",
  "\\/\\/",
  "/",
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

export default function XPathLexer (expression) {
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

  this.tokens = [];

  var currentPos = 0;

  for (var i = 0; i < match.length; i++) {
    var value = match[i];

    if (!/^\s+$/.test(value)) {
      this.tokens.push({
        value: value,
        position: currentPos
      });
    }

    currentPos += value.length;
  }

  this.index = 0;
}

XPathLexer.prototype.length = function () {
  return this.tokens.length;
};

XPathLexer.prototype.next = function () {
  if (this.index === this.tokens.length) {
    return null;
  } else {
    var token = this.tokens[this.index++];

    return token && token.value;
  }
};

XPathLexer.prototype.back = function () {
  if (this.index > 0) {
    this.index--;
  }
};

XPathLexer.prototype.peak = function (n) {
  var token = this.tokens[this.index + (n || 0)];

  return token && token.value;
};

XPathLexer.prototype.empty = function () {
  return this.tokens.length <= this.index;
};

XPathLexer.prototype.position = function () {
  if (this.index === this.tokens.length) {
    var lastToken = this.tokens[this.index - 1];

    return lastToken.position + lastToken.value.length;
  } else {
    return this.tokens[this.index].position;
  }
};
