<?php

	final class OTplFeature_Import
	{
		//SILO:: @import(url [,data]) replacement
		const REG = "#@import\([\s]*?(?:'|\")(.*?)(?:'|\")(?:[\s]*,[\s]*(.+?)[\s]*)?[\s]*\)#";

		public static function exec($in,$context)
		{
			@list($found,$url) = $in;
			echo "totot";
			$data = isset($in[2]) ? $in[2] : null;

			return self::_import($url,$data,$context);
		}

		private static function _import($url,$data_str,$context)
		{
			$root = OTPL_ROOT_DIR;

			if( $context->getSrcPath() ){
				$pinfos = pathinfo($context->getSrcPath());
				$root = $pinfos['dirname']; 
			}

			$url = OPathResolver::resolve($root,$url);

			if ( OTplUtils::isTplFile($url) )
			{
				return " OTplUtils::importExec('$url',$data_str) ";
			} else {
				return " OTplUtils::loadFile('$url') ";
			}
		}
	}

	OTplUtils::addReplacer( OTplFeature_Import::REG , array('OTplFeature_Import','exec'));