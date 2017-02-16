#Map
Write a helper function to auto generate regexp for otpl

```
:space: -------> ([\s]*)
:var: -------> ([$][a-zA-Z0-9_]+)
:data_expression: -------> (.+?)
```

```js
//from
var input = "loop:space:(:space::data_expression::space:\::space::var::space:\::space::var::space:):space:{";

//to

var output = /loop[\s]*\([\s]*(.+?)[\s]*\:[\s]*([$][a-zA-Z0-9_]+)[\s]*(?:\:[\s]*([$][a-zA-Z0-9_]+)[\s]*)?\)[\s]*\{/g;
```