/*
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

//Ex: @import(url,data) --> OTplUtils.importExec(url,data)
OTplUtils.addReplacer({
	reg: /@import\([\s]*?(['"]?(.*?)['"]?)(?:[\s]*,[\s]*(.+?)[\s]*)?[\s]*\)/g,
	val: function () {
		var scope        = this,
			_root        = scope.getSrcDir() || scope.getRootDir(),
			url          = arguments[2],
			data         = arguments[3],
			match        = arguments[0],
			isExpression = !(/^@import\([\s]*?['"]/.test(match));

		if (isExpression) {
			return "OTplUtils.importCustom( '" + escape(_root) + "'," + match.replace(/^@import\([\s]*/, "");
		}

		url = OTplResolver.resolve(_root, url);

		if (_endsWith(url, ".otpl")) {
			var child = (new OTpl()).parse(url);

			scope.addDependencies(child.getDependencies());
			scope.addDependencies([url]);

			return "OTplUtils.importExec('" + url + "'," + data + ")";
		} else {
			return "OTplUtils.loadFile('" + url + "')";
		}
	}
});