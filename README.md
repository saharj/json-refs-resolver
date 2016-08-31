# `json-refs-resolver`

Resolve [JSON Refs](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) in a JSON object

## Work in progress
This module is work in progress and it is not ready for use.

## API
```js
var resolve = require('json-refs-resolver');

var json = {
	foo: 100,
	bar: 'http://example.com/some.json#/foo/bar',
	baz: './baz.json'
}

resolve(json, function(error, result) {
	console.log(result);
});
```

## Developing
Use `npm test` to run test
