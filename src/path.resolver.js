var OPathResolver = {
	DS       : '/',
	resolve  : function ( root, path ) {
		var root = !root ? __DIR__ : this.nomalize( root );
		path     = this.nomalize( path );

		if ( this.isRelative( path ) ) {
			if ( (this.DS === '/' && path[ 0 ] === '/' ) || /^[\w]+:/.test( path ) ) {
				/*$path already start form the root
					/ 	of linux - unix
					D: 	of windows
				*/
				full_path = path;
			} else {
				full_path = root + this.DS + path;
			}

			return this.job( full_path.split( this.DS ) );
		} else {
			return path;
		}
	},
	job      : function ( _in ) {
		var out = array();

		for ( var i = 0 ; i < _in.length ; i++ ) {
			var part = _in[ i ];
			//ignore part that have no value
			if ( !part.length || part === '.' ) continue;

			if ( part !== '..' ) {
				//cool we found a new part
				out.push( part );

			} else if ( out.length > 0 ) {
				//going back up? sure
				out.pop();
			} else {
				//now here we don't like
				throw new Error( "Climbing above root is dangerouse: " + _in.join( this.DS ) );
			}
		}

		return out.join( this.DS );
	},
	nomalize : function ( path ) {
		if ( this.DS == "\\" )  return path.replace( /\//, '\\' );
		return path.replace( /\\\\/, '/' );
	},

	isRelative : function ( path ) {
		return /^\.{1,2}[/\\]?/.test( path )
			|| /[/\\]\.{1,2}[/\\]/.test( path )
			|| /[/\\]\.{1,2}$/.test( path );
	}
}