<?php
	/**
	 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
	 *
	 * This file is part of Otpl.
	 */

	final class OTplPlugin_Html
	{
		public static function SetAttr($data)
		{
			$arr = [];

			foreach ($data as $key => $val) {
				$attr = $key;

				if (strlen($val)) {
					$attr .= '="' . self::Escape($val) . '"';
				}

				array_push($arr, $attr);
			}

			return join($arr, ' ');
		}

		public static function Escape($str)
		{
			$str = htmlentities($str, ENT_QUOTES, 'UTF-8');

			return str_replace("&amp;", "&", $str);
		}
	}

	OTplUtils::addPlugin('HtmlSetAttr', ['OTplPlugin_Html', 'SetAttr']);
	OTplUtils::addPlugin('HtmlEscape', ['OTplPlugin_Html', 'Escape']);