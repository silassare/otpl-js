var isArray       = function ( a ) {
	return a && Object.prototype.toString.call( a ) === '[object Array]';
};
var isPlainObject = function ( a ) {
	return a && Object.prototype.toString.call( a ) === '[object Object]';
};

OTplUtils.addPlugin( 'join', function ( items, sep ) {
	var s = sep || '';

	if ( isArray( items ) ) {
		return items.join( s );
	}

	if ( isPlainObject( items ) ) {
		return Object.values( items ).join( s );
	}

	return "";
} );

OTplUtils.addPlugin( 'concat', function ( a, b ) {
	return [].slice.call( arguments, 0, arguments.length ).join( '' );
} );

OTplUtils.addPlugin( 'length', function ( a ) {
	if ( !a ) return 0;
	if ( Object.hasOwnProperty.call( a, 'length' ) ) return a.length;

	return a;
} );

OTplUtils.addPlugin( 'keys', function ( a ) {

	if ( isArray( a ) || isPlainObject( a ) ) {
		return Object.keys( a );
	}

	return [];
} );

OTplUtils.addPlugin( 'values', function ( a ) {

	if ( isArray( a ) || isPlainObject( a ) ) {
		return Object.values( a );
	}

	return [];
} );