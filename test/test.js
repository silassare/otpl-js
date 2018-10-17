"use strict";

var otpl  = require( '../dist/otpl' ),
	fs    = require( 'fs' ),
	path  = require( 'path' ),
	start = (new Date()).getTime();

if ( !fs.existsSync( './output' ) ) {
	fs.mkdirSync( './output' );
}

var test_run = function ( opt ) {
	var url   = './test/files/' + opt.file;
	var start = (new Date()).getTime();
	var o     = new otpl;

	o.parse( url );

	var end      = (new Date()).getTime();
	var duration = end - start;
	var fname    = path.basename( opt.file );

	fs.writeFileSync( './output/' + fname + '.js', o.getFnString() );
	fs.writeFileSync( './output/' + fname + '.html', o.runWith( opt.data ) );

	console.log(
		"---------------------------------"
		+ "\nFILE             : %s"
		+ "\nSTART            : %d"
		+ "\nEND              : %d"
		+ "\nDURATION (ms)    : %d"
		, opt.file, start, end, duration
	);
};

console.log(
	"\n*********************************************************"
	+ "\n\tOTpl Test results are in %s directory."
	+ "\n_________________________________________________________\n"
	, "./output/"
);

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