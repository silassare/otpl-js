//@var --> var
OTplUtils.addCleaner( {
	reg : /(?!\w)@var(\s+[$][a-zA-Z_])/g,
	val : "var$1"
} );

//$ 	--> __otpl_root.data
OTplUtils.addCleaner( {
	reg : /(\W)\$(\W)/g,
	val : "$1__otpl_root.data$2"
} );

OTplUtils.addCleaner( {
	reg : /^\$(\W)/g,
	val : "__otpl_root.data$1"
} );

//@fn(...) --> OTplUtils.runPlugin('fn',...)
//shouldn't match @import(
OTplUtils.addCleaner( {
	reg : /(?!\w)@((?!import\()[a-zA-Z_][a-zA-Z0-9_]+)\(/g,
	val : "OTplUtils.runPlugin('$1',"
} );