# xpath-lexer

[![Build Status](https://travis-ci.org/badeball/xpath-lexer.svg?branch=master)](https://travis-ci.org/badeball/xpath-lexer)

A lexer for XPath 1.0 expressions.

## Installation

The package can be installed with `npm`.

```
$ npm install xpath-lexer
```

## Usage


```javascript
var XPathLexer = require("xpath-lexer");

var lexer = new XPathLexer("//foo:bar[@id='baz']");

lexer.next() // => "//"
lexer.next() // => "foo:bar"
lexer.next() // => "["
lexer.next() // => "@"
lexer.next() // => "id"
lexer.next() // => "="
lexer.next() // => "'baz'"
lexer.next() // => "]"
```
