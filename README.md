# OTPL

A simple template system, write once run everywhere with JavaScript (nodejs or in browser ), PHP ...

## Your [contributions](https://github.com/silassare/otpl/) are welcomed

[![NPM](https://nodei.co/npm/otpl-js.png?downloads=true)](https://www.npmjs.com/package/otpl-js)

## Setup with npm

```sh
$ npm install otpl-js
```

## Run Build

```sh
$ npm run-script build
```

## Run Test

```sh
$ npm run-script test
```

## Use case

### Input: your template.otpl file content

```html
	<label for="<% $.input.id %>"><% $.label.text %></label>
	<input <% @HtmlSetAttrs($.input) %> />
```

### Usage: nodejs

```javascript

var otpl = require('otpl-js');
var data = {
		'label' : {
			'text' : 'Your password please :',
		},
		'input' : {
			'id' : 'pass_field',
			'type' : 'password',
			'name' : 'pass'
		}
	};
//get otpl instance
var o = new otpl();
//parse your template
	o.parse('template.otpl');
//run your templated with your input data 
var output = o.runWith(data);

	console.log(output);
```

### Usage: browser

```javascript

var data = {
		'label' : {
			'text' : 'Your password please :',
		},
		'input' : {
			'id' : 'pass_field',
			'type' : 'password',
			'name' : 'pass'
		}
	};

//get otpl instance
var o = new OTpl();
//parse your template
	o.parse('template.otpl');
//run your templated with your input data 
var output = o.runWith(data);

	console.log(output);

```

### Usage: php

```php
	include 'OTpl.php';

	$otpl = new OTpl();
	$otpl->parse('template.otpl');
	$data = array(
		'label' => array(
			'text' => 'Your password please :',
		),
		'input' => array(
			'id' => 'pass_field',
			'type' => 'password',
			'name' => 'pass'
		)
	);

	$otpl->runWith($data);

```

### Output

```html
	<label for="pass_field">Your password please :</label>
	<input type="password" id="pass_field" name="pass" />
```

