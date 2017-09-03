/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

var OTplResolver = {
	DS      : '/',

	resolve : function ( ro_ot, path ) {
		ro_ot = this.normalize( ro_ot );
		path = this.normalize( path );

		if ( this.isRelative( path ) ) {
			var full_path;

			if ( path[ 0 ] === '/' || /^[\w]+:/.test( path ) ) {
				// path start form the root
				// linux - unix	-> /
				// windows		-> D:

				full_path = path;
			} else {
				full_path = ro_ot + this.DS + path;
			}

			path = this.job( full_path ).replace(/^(https?):[/]([^/])/,"$1://$2");
		}

		return path;
	},

	job     : function ( path ) {
		var _in = path.split( this.DS );
		var out = [];

		// preserve linux root first char '/' like in: /root/path/to/
		if ( path[ 0 ] === this.DS ) {
			out.push( '' );
		}

		for ( var i = 0 ; i < _in.length ; i++ ) {
			var part = _in[ i ];
			// ignore part that have no value
			if ( !part.length || part === '.' ) continue;

			if ( part !== '..' ) {
				// cool we found a new part
				out.push( part );

			} else if ( out.length > 0 ) {
				// going back up? sure
				out.pop();
			} else {
				// now here we don't like
				throw new Error( "climbing above root is dangerouse: " + path );
			}
		}

		if ( !out.length ) {
			return this.DS;
		}

		if ( out.length === 1 ) {
			out.push( null );
		}

		return out.join( this.DS );
	},

	normalize : function ( path ) {
		return path.replace( /\\/g, '/' );
	},

	isRelative : function ( path ) {
		return /^\.{1,2}[/\\]?/.test( path )
			|| /[/\\]\.{1,2}[/\\]/.test( path )
			|| /[/\\]\.{1,2}$/.test( path )
			|| /^[a-zA-Z0-9_.][^:]*$/.test( path );
	}
};