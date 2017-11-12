<?php
	/**
	 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
	 *
	 * This file is part of Otpl.
	 */

	final class OTplFeature_Import
	{
		// SILO:: @import(url [,data]) replacement
		// const REG = '#@import\([\s]*?[\'"]?(.*?)[\'"]?(?:[\s]*,[\s]*(.+?)[\s]*)?[\s]*\)#';
		const REG = '#@import\([\s]*?([\'"]?(.*?)[\'"]?)(?:[\s]*,[\s]*(.+?)[\s]*)?[\s]*\)#';

		public static function exec($in, OTpl $context)
		{
			$src_dir = $context->getSrcDir();
			$root    = ($src_dir) ? $src_dir : OTPL_ROOT_DIR;

			$match         = $in[0];
			$is_expression = !preg_match("#^@import\([\s]*?['\"]#", $match);

			if ($is_expression) {
				return " OTplUtils::importCustom( '$root'," . preg_replace("#^@import\([\s]*#", "", $match);
			}

			$url      = $in[2];
			$data_str = isset($in[3]) ? $in[3] : null;

			$url = OTplResolver::resolve($root, $url);

			if (OTplUtils::isTplFile($url)) {
				return " OTplUtils::importExec( '$url', $data_str ) ";
			}

			return " OTplUtils::loadFile( '$url' ) ";
		}
	}

	OTplUtils::addReplacer(OTplFeature_Import::REG, ['OTplFeature_Import', 'exec']);