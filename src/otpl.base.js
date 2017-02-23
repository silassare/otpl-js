/*! OTpl js-1.1.2
	by Silas E. Sare (silo)
*/

(function ( gscope ) {
	'use strict';
	/*
		--> keywords: OTpl, OTPL, __otpl or anything starting with it
	
		--> variables, expression, script must be between <% and %>
		--> tabulation, space,LF, CRLF... before <% and after %> are removed
		--> variable name must be declared with @var $my_var_name
		--> variable name must start with $ as in php
		--> e.g: @var $my_var_name
		
		--> tabulation and new line must be escaped like \\t and \\n
	
		--> if data = { age:23, nom:'toto' }
			-access to age : $.age, $['age'] or $.age
			-access to nom : $.nom, $['nom'] or $.nom
	
		--> if data = [23,'toto']
			-access to 23 : $[0]
			-access to 'toto' : $[1]
	*/

	var
		isFunc           = function ( fn ) {
			return typeof fn === 'function';
		},
		isPlainObject    = function ( a ) {
			return Object.prototype.toString.apply( a ) === "[object Object]";
		},
		indent           = function ( code, n ) {
			var tabs = Array( n || 1 ).fill( '\t' ).join( '' );
			return code.toString().replace( /(?:\n|\r\n)(.)/g, function ( t, c ) {
				return '\n' + tabs + (c || '')
			} );
		},

		TEMP_FILE_STORE  = {},
		//use only for debug
		OTPL_SAMPLE_FILE = {OTPL::SAMPLE_OUTPUT_FILE},

		OTpl_compiled    = {},
		OTpl_plugins     = {},
		OTpl_replacers   = [],
		OTpl_cleaners    = [],

		OTplUtils        = {
			expose           : {},
			register         : function ( compile_desc, fn ) {

				if ( !isPlainObject( compile_desc ) || !isFunc( fn ) ) throw "OTpl > can't register, invalid otpl output.";

				var func_name = compile_desc.func_name;

				OTpl_compiled[ func_name ] = fn;
			},
			addCleaner       : function ( cl ) {
				OTpl_cleaners.push( cl );
			},
			addReplacer      : function ( rp ) {
				OTpl_replacers.push( rp );
			},
			addPlugin        : function ( pl_name, pl ) {
				OTpl_plugins[ pl_name ] = pl;
			},
			getCleaners      : function () {
				return OTpl_cleaners;
			},
			getReplacers     : function () {
				return OTpl_replacers;
			},
			getPlugins       : function () {
				return OTpl_plugins;
			},
			runPlugin        : function ( pl_name ) {
				var pl = OTpl_plugins[ pl_name ];

				if ( isFunc( pl ) ) {
					var args = [].slice.call( arguments, 1, arguments.length );

					return pl.apply( null, args );
				}

				throw "OTpl > plugin '" + pl_name + "' not found.";
			},
			importExec       : function ( url, data ) {
				var o = OTpl_compiled[ url ];
				if ( o instanceof OTpl ) return o.runWith( data );
				else if ( isFunc( o ) ) return o( OTplUtils, data );
				else throw "OTpl > '" + url + "' is required as dependance.";
			},
			loadFile         : function ( url ) {
				if ( !(url in TEMP_FILE_STORE) ) {
					if ( typeof XMLHttpRequest === 'function' ) {
						var xhr = new XMLHttpRequest();
						xhr.open( "GET", url, false );//<-- synchrone
						xhr.send( null );

						if ( xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300) ) {
							TEMP_FILE_STORE[ url ] = xhr.responseText;
						} else {
							throw "OTpl > can't read file at url : " + url + " status : " + xhr.status;
						}
					} else if ( isFunc( require ) ) {
						var fs = require( 'fs' );
						if ( fs.existsSync( url ) && fs.lstatSync( url ).isFile() ) {
							TEMP_FILE_STORE[ url ] = fs.readFileSync( url, 'utf8' );
						} else {
							throw "OTpl > can't read file at url : " + url;
						}
					} else {
						throw "OTpl > can't load file at url : " + url;
					}
				}

				return TEMP_FILE_STORE[ url ];
			},
			textToLineString : function ( txt ) {
				return ( '' + txt ).replace( /"/g, '\\"' )
								   .replace( /\t/g, '\\t' )
								   .replace( /\n/g, '\\n' )
								   .replace( /\r/g, '\\r' );
			}
		};

	/**START::FEATURES**/
	{CORE::FEATURES}
	/**END::FEATURES**/

	/**START::PLUGINS**/
	{CORE::PLUGINS}
	/**END::PLUGINS**/

	var OTpl = function () {
		var scope                = this,
			OTPL_TAG_REG         = /<%(.+?)?%>/g,
			OTPL_SCRIPT_REG      = /^(\s*)?(if|else|for|while|break|continue|switch|case|default|})/,
			OTPL_TYPE_EXPRESSION = 0,
			OTPL_TYPE_SCRIPT     = 1;

		this.dependancies = [];

		var runReplacement = function ( list, source ) {
			for ( var i = 0 ; i < list.length ; i++ ) {
				var rule = list[ i ],
					reg  = rule[ 'reg' ],
					val  = rule[ 'val' ];

				if ( isFunc( val ) ) {
					source = source.replace( reg, function () {
						return val.apply( scope, arguments );
					} );
				} else {
					source = source.replace( reg, val );
				}
			}

			return source;
		};

		var Engine = function ( tpl ) {
			var code   = "\n",
				cursor = 0, found;

			var Add = function ( line, type ) {
				if ( line != '' ) {
					switch ( type ) {
						case OTPL_TYPE_EXPRESSION:
							code += '__otpl_root.out.push(' + line + ');\n';
							break;
						case OTPL_TYPE_SCRIPT:
							code += line + '\n';
							break;
						default:
							line = OTplUtils.textToLineString( line );
							code += '__otpl_root.out.push("' + line + '");\n';
					}
				}
			};

			while ( found = OTPL_TAG_REG.exec( tpl ) ) {

				var source = runReplacement( OTplUtils.getCleaners(), found[ 1 ] );
				source     = runReplacement( OTplUtils.getReplacers(), source );

				Add( tpl.slice( cursor, found.index ) );

				if ( OTPL_SCRIPT_REG.test( source ) ) {
					Add( source, OTPL_TYPE_SCRIPT );
				} else {
					Add( source, OTPL_TYPE_EXPRESSION );
				}

				cursor = found.index + found[ 0 ].length;
			}

			Add( tpl.substr( cursor, tpl.length - cursor ) );

			code += 'return __otpl_root.out.join("");';

			return code;
		};

		this.parse = function ( tpl ) {
			var isUrl = /\.otpl$/.test( tpl );//SILO::TODO not safe 

			if ( isUrl ) {
				var obj = OTpl_compiled[ tpl ];
				if ( obj instanceof OTpl ) {
					this.output = obj.getOutput();
				} else {
					this.output = Engine( OTplUtils.loadFile( tpl ) );
				}

				this.func_name = this.url = tpl;
				OTpl_compiled[ tpl ] = this;
			} else {
				this.output    = Engine( tpl );
				this.func_name = (new Date()).getTime() + '_' + Math.random();
			}

			return this;
		};
	};

	OTpl.prototype = {
		func_name       : '',
		url             : 'inline.template.otpl',
		addDependancies : function ( deps ) {
			for ( var i = 0 ; i < deps.length ; i++ ) {
				var dep = deps[ i ];
				if ( this.dependancies.indexOf( dep ) < 0 ) {
					this.dependancies.push( dep );
				}
			}
		},
		getDependancies : function () {
			return this.dependancies;
		},
		output          : function () {
			return "";
		},
		getOutput       : function () {
			return this.output;
		},
		runWith         : function ( data ) {
			var r = { out : [], data : data };
			return (new Function( 'OTplUtils', '__otpl_root', this.output ))( OTplUtils, r );
		},
		getFnString     : function () {
			var desc = {
					'{otpl_version}'      : OTpl.OTPL_VERSION,
					'{otpl_version_name}' : OTpl.OTPL_VERSION_NAME,
					'{otpl_src_path}'     : this.url,
					'{otpl_func_name}'    : this.func_name,
					'{otpl_compile_time}' : parseInt( (new Date).getTime() / 1000 ),
					'{otpl_file_content}' : indent( this.getOutput(), 2 )
				},
				out  = OTPL_SAMPLE_FILE;

			Object.keys( desc ).forEach( function ( key, index ) {
				out = out.replace( new RegExp( key, 'g' ), desc[ key ] );
			} );

			return out;
		},
		exports         : function ( fname ) {

			if ( typeof module === 'object' && module.exports ) {
				throw 'OTpl > exports is for test in browser only!';
			}

			var file_content = "";

			for ( var i = 0 ; i < this.dependancies.length ; i++ ) {
				var dep     = this.dependancies[ i ];
				var dep_obj = OTpl_compiled[ dep ];
				file_content += dep_obj.getFnString() + "\n";
			}

			file_content += this.getFnString();

			var b = new Blob( [ file_content ], { type : 'application/x-javascript' } );

			return URL.createObjectURL( new File( [ b ], fname ) );
		}
	};

	OTpl.OTPL_VERSION      = "js-1.1.2";
	OTpl.OTPL_VERSION_NAME = "OTpl js-1.1.2";

	OTpl.register = OTplUtils.register;

	if ( typeof define === 'function' && define.amd ) {
		define( function () {
			return OTpl;
		} );
	} else if ( typeof module === 'object' && module.exports ) {
		module.exports = OTpl;
	} else {
		gscope.OTpl = OTpl;
	}

}( this ));