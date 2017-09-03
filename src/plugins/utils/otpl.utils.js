/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

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
	if ( isPlainObject( a ) ) return Object.keys(a).length;
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

// es6: fn = (exp, a = '', b = '') => ( exp? a : b );

OTplUtils.addPlugin( 'if', function ( exp, a, b ) {
	a = ( a === undefined )? '' : a;
	b = ( b === undefined )? '' : b;

	return ( exp )? a : b;
} );