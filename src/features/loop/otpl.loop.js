/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

OTplUtils.expose.looper = function ( data ) {
	var i             = 0,
		len           = 0,
		keys          = [],
		arr           = Array.isArray( data ),
		isPlainObject = function ( a ) {
			return Object.prototype.toString.call( a ) === "[object Object]";
		};

	if ( !arr && !isPlainObject( data ) ) {
		throw "OTPL : looper can't loop on data";
	}

	if ( arr ) {
		len = data.length;
	} else {
		keys = Object.keys( data );
		len  = keys.length;
	}

	return {
		key   : null,
		value : null,
		next  : function () {
			var ok = (i < len) ? 1 : 0;
			if ( ok ) {
				this.key   = (arr) ? i : keys[ i ];
				this.value = data[ this.key ];
				i++;
			}

			return ok;
		}
	};
};

var looper_id = 0;

OTplUtils.addReplacer( {
	reg : /loop[\s]*\([\s]*(.+?)[\s]*:[\s]*([$][a-zA-Z0-9_]+)[\s]*(?::[\s]*([$][a-zA-Z0-9_]+)[\s]*)?\)[\s]*{/g,
	val : function () {
		var data             = arguments[ 1 ],
			key_name         = arguments[ 2 ],
			value_name       = arguments[ 3 ],
			__otpl_looper_n_ = "__otpl_looper_" + (++looper_id) + "_";

		if ( !(value_name === undefined) ) {
			return "for(var " + __otpl_looper_n_ + " = OTplUtils.expose.looper(" + data + "); " + __otpl_looper_n_ + ".next();){" +
				"\nvar " + key_name + " = " + __otpl_looper_n_ + ".key, " + value_name + " = " + __otpl_looper_n_ + ".value;";
		} else {
			value_name = key_name;
			return "for(var " + __otpl_looper_n_ + " = OTplUtils.expose.looper(" + data + "); " + __otpl_looper_n_ + ".next();){" +
				"\nvar " + value_name + " = " + __otpl_looper_n_ + ".value;";
		}
	}
} );