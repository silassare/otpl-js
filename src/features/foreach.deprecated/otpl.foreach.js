//foreach ( $obj as $key=>$val){ --> for ($key in $obj) { var $val = $obj[$key];
OTplUtils.addReplacer( {
	reg : /foreach[\s]*\([\s]*(.*?)[\s]+(?:as)[\s]+(.+?)[\s]*=>[\s]*(.+?)[\s]*\)[\s]*\{/g,
	val : 'for ($2 in $1) { var $3 = $1[$2]; '
} );
