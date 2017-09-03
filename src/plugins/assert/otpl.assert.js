/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

var utils = {};

utils.has = function ( data, key, type ) {

	if ( !data ) return false;

	return ( !type && data[ key ] != undefined )
	|| ( data[ key ] != undefined && utils.type( data[ key ], type ) );
};

utils.type = function ( value, type ) {
	var ans = false;

	switch ( type ) {
		case 'string':
			ans = ( typeof value === 'string');
			break;
		case 'map':
			var str = Object.prototype.toString.call( value );
			ans     = ( str === '[object Array]' || str === '[object Object]' );
			break;
		case 'numeric':
			ans = !isNaN( value );
			break;
	}

	return ans;
};

OTplUtils.addPlugin( 'has', utils.has );
OTplUtils.addPlugin( 'type', utils.type );