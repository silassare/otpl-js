OTplUtils.addPlugin( 'HtmlSetAttr', function ( key, val ) {
	var _    = " ",
		data = {};

	if ( typeof key === 'string' ) {
		data[ key ] = val;
	} else {
		data = arguments[ 0 ];
	}

	for ( var attr in data ) {
		var value = OTplUtils.textToLineString( data[ attr ] );
		_ += ' ' + attr;

		if ( value.length ) {
			_ += '="' + value + '"';
		}
	}

	return _ + ' ';
} );