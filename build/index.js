var fs   = require( 'fs' );
var path = require( 'path' );

//indent code
var indent = function ( code, n ) {
	var tabs = Array( n || 1 ).fill( '\t' ).join( '' );

	return code.toString().replace( /(?:\n|\r\n)(.)/g, function ( t, c ) {
		return '\n' + tabs + (c || '')
	} );
};

//walk into directory and ignore dir_name.deprecated
//search for file like otpl.dir_name.js
//make a bundle as output
var dirBundle = function ( dir, cb ) {
	var list   = fs.readdirSync( dir );
	var output = "";
	list.forEach( function ( cd_name, i ) {
		var cd = path.resolve( dir, cd_name );

		if ( !/\.deprecated$/.test( cd ) && fs.lstatSync( cd ).isDirectory() ) {
			var index = path.resolve( cd, `otpl.${cd_name}.js` );

			if ( fs.existsSync( index ) && fs.lstatSync( index ).isFile() ) {
				var content = fs.readFileSync( index );
				content     = indent( content );
				output += `//${dir + cd_name}\n(function(){\n\t${content}\n})();\n\n`;
			}
		}

	} );

	return output;
};

var features           = dirBundle( './src/features/' );
var plugins            = dirBundle( './src/plugins/' );
var path_resolver      = fs.readFileSync( './src/otpl.resolver.js' );
var sample_output_file = '"'
	+ fs.readFileSync( './src/output.js.sample' )
		.toString()
		.replace( /"/g, '\\"' )
		.replace( /\t/g, '\\t' )
		.replace( /\n/g, '\\n' )
		.replace( /\r/g, '\\r' )
	+ '"';

var bundle = fs.readFileSync( './src/otpl.base.js', 'utf8' )
			   .replace( "{OTPL::SAMPLE_OUTPUT_FILE}", sample_output_file )
			   .replace( "{OTPL::FEATURES}", indent( features ) )
			   .replace( "{OTPL::PLUGINS}", indent( plugins ) )
			   .replace( "{OTPL::RESOLVER}", indent( path_resolver ) );

if ( !fs.existsSync( './dist' ) ) {
	fs.mkdirSync( './dist' );
}

fs.writeFileSync( './dist/otpl.js', bundle );