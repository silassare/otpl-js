<?php
/**
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

final class OTplPlugin_Utils {
		public static function join( $items, $sep = '' ) {
			return implode( $sep, $items );
		}

		public static function concat( $a, $b ) {
			return join( func_get_args(), '' );
		}

		public static function keys( $data ) {
			if ( is_array( $data ) )
				return array_keys( $data );

			return array();
		}

		public static function values( $data ) {
			if ( is_array( $data ) )
				return array_values( $data );

			return array();
		}

		public static function length( $value ) {

			if ( is_string( $value ) )
				return strlen( $value );

			return count( $value );
		}

		public static function _if( $exp , $a = '' , $b = '' ) {
			return ( $exp ) ? $a : $b;
		}
	}

	OTplUtils::addPlugin( 'join', array( 'OTplPlugin_Utils', 'join' ) );
	OTplUtils::addPlugin( 'concat', array( 'OTplPlugin_Utils', 'concat' ) );
	OTplUtils::addPlugin( 'keys', array( 'OTplPlugin_Utils', 'keys' ) );
	OTplUtils::addPlugin( 'values', array( 'OTplPlugin_Utils', 'values' ) );
	OTplUtils::addPlugin( 'length', array( 'OTplPlugin_Utils', 'length' ) );
	OTplUtils::addPlugin( 'if', array( 'OTplPlugin_Utils', '_if' ) );