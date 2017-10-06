<?php
	/**
	 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
	 *
	 * This file is part of Otpl.
	 */

	final class OTplPlugin_Utils
	{
		public static function join($items, $sep = '')
		{
			return implode($sep, $items);
		}

		public static function concat($a, $b)
		{
			return join(func_get_args(), '');
		}

		public static function keys($data)
		{
			if (is_array($data)) return array_keys($data);

			return [];
		}

		public static function values($data)
		{
			if (is_array($data)) return array_values($data);

			return [];
		}

		public static function length($value)
		{
			if (is_string($value)) return strlen($value);
			if (is_bool($value) OR is_numeric($value) OR is_null($value)) return intval($value);

			return count($value);
		}

		public static function _if($exp, $a = '', $b = '')
		{
			return ($exp ? $a : $b);
		}
	}

	OTplUtils::addPlugin('join', ['OTplPlugin_Utils', 'join']);
	OTplUtils::addPlugin('concat', ['OTplPlugin_Utils', 'concat']);
	OTplUtils::addPlugin('keys', ['OTplPlugin_Utils', 'keys']);
	OTplUtils::addPlugin('values', ['OTplPlugin_Utils', 'values']);
	OTplUtils::addPlugin('length', ['OTplPlugin_Utils', 'length']);
	OTplUtils::addPlugin('if', ['OTplPlugin_Utils', '_if']);