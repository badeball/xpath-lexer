'use strict';

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
class XPathLexer {
    constructor(expression) {
        var match = expression.match(lexer);
        if (match === null) {
            throw new Error("Invalid character at position 0");
        }
        if (match.join("") !== expression) {
            var position = 0;
            for (var i = 0; i < match.length; i++) {
                if (expression.indexOf(match[i]) !== position) {
                    break;
                }
                position += match[i].length;
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
    length() {
        return this.tokens.length;
    }
    next() {
        if (this.index === this.tokens.length) {
            return null;
        }
        else {
            var token = this.tokens[this.index++];
            return token && token.value;
        }
    }
    back() {
        if (this.index > 0) {
            this.index--;
        }
    }
    peak(n) {
        var token = this.tokens[this.index + (n || 0)];
        return token && token.value;
    }
    empty() {
        return this.tokens.length <= this.index;
    }
    position() {
        if (this.index === this.tokens.length) {
            var lastToken = this.tokens[this.index - 1];
            return lastToken.position + lastToken.value.length;
        }
        else {
            return this.tokens[this.index].position;
        }
    }
}

module.exports = XPathLexer;
