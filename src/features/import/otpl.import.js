/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

//Ex: @import(url,data) --> OTplUtils.importExec(url,data)
OTplUtils.addReplacer( {
	reg : /@import\([\s]*?(['"]?(.*?)['"]?)(?:[\s]*,[\s]*(.+?)[\s]*)?[\s]*\)/g,
	val : function () {
		var scope = this,
			_root = scope.getSrcDir() || scope.getRootDir(),
			isExpression = (arguments[ 1 ] === arguments[ 2 ]),
			url   = arguments[ 2 ],
			data  = arguments[ 3 ];


		if( isExpression ){
			var expression = arguments[ 1 ];

			return "OTplUtils.importCustom( '" + escape(_root) + "', " + expression + "," + data + ")";
		}

		url = OTplResolver.resolve( _root, url );

		if ( _endsWith( url , '.otpl' ) ) {
			var child = (new OTpl()).parse( url );

			scope.addDependancies( child.getDependancies() );
			scope.addDependancies( [ url ] );

			return "OTplUtils.importExec('" + url + "'," + data + ")";
		} else {
			return "OTplUtils.loadFile('" + url + "')";
		}
	}
} );