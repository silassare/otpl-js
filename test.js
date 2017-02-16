"use strict";

var otpl = require('./index'),
	fs = require('fs'),
	start = (new Date()).getTime();

	if( !fs.existsSync('./output') ){
		fs.mkdirSync('./output');
	}

var	test_run = function(opt){
	var url = './files/' + opt.file ;
	var start = (new Date()).getTime();
	var o = new otpl;
		o.parse(url);
	var end = (new Date()).getTime();

	fs.writeFileSync('./output/'+opt.file+'.js',o.getFnString());
	fs.writeFileSync('./output/'+opt.file+'.html',o.runWith(opt.data));

	console.log(opt.file);
	console.log("\tstart: %d",start);
	console.log("\tend: %d",end);
	console.log("\tduration: %d ms",end-start);
	console.log("_________________________");
};

console.log("\n*********************************************************");
console.log("\tOTpl Test results are in %s directory.", "./output/");
console.log("_________________________________________________________\n");

test_run({
	'file': 'test-var-1.otpl',
	'data': ['Franck',23]
});

test_run({
	'file': 'test-var-2.otpl',
	'data': {
		'name': 'Franck',
		'age': 23
	}
});


test_run({
	'file': 'test-var-3.otpl',
	'data': [
		{
			'name': 'Stella',
			'age': 41
		},{
			'name': 'Steve'
		},{
			'name': 'Franck',
			'age': 23
		}
	]
});

test_run({
	'file': 'test-attr.otpl',
	'data':{
		'input': {
			'id':'name-field',
			'type':'text',
			'placeholder':'Name',
			'value':'toto'
		},
		'label':'Your name:'
	}
});

test_run({
	'file': 'test-loop.otpl',
	'data':{
		1:'Apple',
		2:'HTC',
		3:'Samsung'
	}
});