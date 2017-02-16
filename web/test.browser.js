"use strict";

var test_run = function(opt){

		var out = document.getElementById("out");

		var start = (new Date()).getTime();
		var obj = new OTpl();
		var result = obj.parse('../files/' + opt.file).runWith(opt.data);
		var end = (new Date()).getTime();

		var res_link = document.createElement('a');
		var js_link = document.createElement('a');
		var fname = opt['file'].replace(/[^\w]+/g,"_");
		var js_fname = fname + ".js";
		var res_fname = fname + ".html";

		js_link.href = obj.exports(js_fname);
		js_link.textContent = js_link.download = js_fname;

		res_link.href = URL.createObjectURL(new File([new Blob([result],{type:'text/plain'})],res_fname));
		res_link.textContent = res_link.download = res_fname;

		document.body.innerHTML += "<br/>start: "+start+"<br/>end: "+end+"<br/>duration: "+(end-start)+" ms<br/>";
		document.body.appendChild(js_link);
		document.body.innerHTML += "<br/>";
		document.body.appendChild(res_link);
		document.body.innerHTML += "<br/>";
	};

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