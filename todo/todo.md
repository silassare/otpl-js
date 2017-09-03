- support for @var
	@var $myvar => 
			-js /*:__otpl:var*/ var $myvar
			-php /*:__otpl:var*/ $myvar
	- detect it as script with
			\/\*__otpl:var\*\/\s+var\s+[$][a-zA-Z_][a-zA-Z0-9_]*

- try to have the same output for otpl-js and otpl-php (for sure? lol)
	-- fixe: new line are added or removed when template are interpreted with php version of otpl 