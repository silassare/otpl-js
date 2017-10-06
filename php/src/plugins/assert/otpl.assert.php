<?php
	/**
	 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
	 *
	 * This file is part of Otpl.
	 */

	final class OTplPlugin_Assert
	{
		public static function has($data, $key, $type = null)
		{
			if (!$data) return false;

			return (empty($type) AND isset($data[$key])) OR (isset($data[$key]) AND self::type($data[$key], $type));
		}

		public static function type($value, $type)
		{
			$ans = false;

			switch ($type) {
				case 'string':
					$ans = is_string($value);
					break;
				case 'map':
					$ans = is_array($value);
					break;
				case 'numeric':
					$ans = is_numeric($value);
					break;
			}

			return $ans;
		}
	}

	OTplUtils::addPlugin('has', ['OTplPlugin_Assert', 'has']);
	OTplUtils::addPlugin('type', ['OTplPlugin_Assert', 'type']);