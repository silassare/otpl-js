<?php
	/**
	 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
	 *
	 * This file is part of Otpl.
	 */

	final class OTplUtils
	{
		const OTPL_STR_KEY_NAME_REG = "#^[a-z_][a-z0-9_]*$#i";
		const OTPL_ROOT_REF         = "\$otpl_root";
		const OTPL_DATA_REF         = "\$otpl_data";
		const OTPL_FILE_EXT         = "#\.otpl$#";

		private static $cleaners  = [];
		private static $replacers = [];
		private static $plugins   = [];

		public static function isTplFile($url)
		{
			return preg_match(self::OTPL_FILE_EXT, $url);//SILO::TODO not safe
		}

		public static function addCleaner($reg, $cln_callable)
		{
			self::$cleaners[] = [$reg, $cln_callable];
		}

		public static function addReplacer($reg, $rpl_callable)
		{
			self::$replacers[] = [$reg, $rpl_callable];
		}

		public static function addPlugin($name, $pl)
		{
			self::$plugins[$name] = $pl;
		}

		public static function getCleaners()
		{
			return self::$cleaners;
		}

		public static function getReplacers()
		{
			return self::$replacers;
		}

		public static function getPlugins()
		{
			return self::$plugins;
		}

		public static function runPlugin($name)
		{
			if (isset(self::$plugins[$name])) {
				$fn   = self::$plugins[$name];
				$args = array_slice(func_get_args(), 1);

				if (is_callable($fn)) {
					return call_user_func_array($fn, $args);
				}

				throw new Exception("OTPL : plugin `$name` is not callable.");
			}

			throw new Exception("OTPL : plugin `$name` is not defined.");
		}

		public static function loadFile($src)
		{
			if (empty($src) || !file_exists($src) || !is_file($src) || !is_readable($src)) {
				throw new Exception("OTPL : Unable to access file at : $src");
			}

			return file_get_contents($src);
		}

		public static function importExec($url, $data)
		{
			$o = new OTpl();
			$o->parse($url);

			ob_start();
			$o->runWith($data);

			return ob_get_clean();
		}

		public static function importCustom($root, $url, $data)
		{
			$url = OTplResolver::resolve($root, $url);

			if (self::isTplFile($url)) {
				return self::importExec($url, $data);
			}

			return self::loadFile($url);
		}
	}