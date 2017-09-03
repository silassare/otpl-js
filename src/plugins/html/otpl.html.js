/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

OTplUtils.addPlugin( 'HtmlSetAttr', function ( key, val ) {
	var data = {},
		arr  = [];

	if ( typeof key === 'string' ) {
		data[ key ] = val;
	} else {
		data = arguments[ 0 ];
	}

	Object.keys(data).forEach(function(attr){
		var value = OTplUtils.runPlugin( 'HtmlEscape', data[ attr ] ),
			_     = attr;

		if ( value.length ) {
			_ += '="' + value + '"';
		}

		arr.push( _ );
	});

	return arr.join( ' ' );
} );

var escapeChars = {
		'¢'  : 'cent',
		'£'  : 'pound',
		'¥'  : 'yen',
		'€'  : 'euro',
		'©'  : 'copy',
		'®'  : 'reg',
		'<'  : 'lt',
		'>'  : 'gt',
		'"'  : 'quot',
		'&'  : 'amp',
		'\'' : '#39'
	},
	escapeReg   = new RegExp( '[' + Object.keys( escapeChars ).join( '' ) + ']', 'g' ),
	ampReg      = new RegExp( '&amp;', 'g' );

OTplUtils.addPlugin( 'HtmlEscape', function ( str ) {
	str = (''+str).replace( escapeReg, function ( m ) {
		return '&' + escapeChars[ m ] + ';';
	} );

	return str.replace( ampReg, '&' );
} );