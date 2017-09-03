"use strict";

var test_run = function ( opt ) {

	var out = document.getElementById( "out" );

	var start    = (new Date()).getTime();
	var obj      = new OTpl();
	var result   = obj.parse( '/otpl/files/' + opt.file ).runWith( opt.data );
	var end      = (new Date()).getTime();
	var duration = end - start;

	var fname     = opt[ 'file' ].replace( /[^\w]+/g, "_" );
	var js_fname  = fname + ".js";
	var res_fname = fname + ".html";

	var js_link  = obj.exports( js_fname );
	var res_link = URL.createObjectURL( new File( [ new Blob( [ result ], { type : 'text/plain' } ) ], res_fname ) );

	document.body.innerHTML +=
		"<table>"
		+ "<tbody>"
		+ "<tr><td>SOURCE</td><td>" + opt.file + "</td></tr>"
		+ "<tr><td>OUTPUT SOURCE</td><td><a href='" + js_link + "'>Open</a>&nbsp;<a href='" + js_link + "' download='" + js_fname + "'>Download</a></td></tr>"
		+ "<tr><td>OUTPUT FILE</td><td><a href='" + res_link + "'>Open</a>&nbsp;<a href='" + res_link + "' download='" + res_fname + "'>Download</a></td></tr>"
		+ "<tr><td>START</td><td>" + start + "</td></tr>"
		+ "<tr><td>END</td><td>" + end + "</td></tr>"
		+ "<tr><td>DURATION (ms) </td><td>" + duration + "</td></tr>"
		+ "</tbody>"
		+ "</table>";
};

test_run( {
	'file' : 'test-var-1.otpl',
	'data' : [ 'Franck', 23 ]
} );

test_run( {
	'file' : 'test-var-2.otpl',
	'data' : {
		'name' : 'Franck',
		'age'  : 23
	}
} );

test_run( {
	'file' : 'test-var-3.otpl',
	'data' : [
		{
			'name' : 'Stella',
			'age'  : 41
		}, {
			'name' : 'Steve'
		}, {
			'name' : 'Franck',
			'age'  : 23
		}
	]
} );

test_run( {
	'file' : 'test-attr.otpl',
	'data' : {
		'input' : {
			'id'          : 'name-field',
			'type'        : 'text',
			'placeholder' : 'Name',
			'value'       : 'toto'
		},
		'label' : 'Your name:'
	}
} );

test_run( {
	'file' : 'test-loop.otpl',
	'data' : {
		1 : 'Apple',
		2 : 'HTC',
		3 : 'Samsung'
	}
} );

test_run( {
	'file' : 'sub/test-import.otpl',
	'data' : {
		'custom_import':['./../custom-import.otpl',2017],
		'data_a' : [ 'Franck', 23 ],
		'data_b' : {
			'input' : {
				'id'          : 'name-field',
				'type'        : 'text',
				'placeholder' : 'Name',
				'value'       : 'toto'
			},
			'label' : 'Your name:'
		}
	}
} );