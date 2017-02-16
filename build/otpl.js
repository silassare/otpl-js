/*! OTpl js-1.1.2
	by Silas E. Sare (silo)
*/

(function(gscope){
	'use strict';
/*
	--> keywords: OTpl, OTPL, __otpl or anything starting with it

	--> variables, expression, script must be between <% and %>
	--> tabulation, space,LF, CRLF... before <% and after %> are removed
	--> variable name must be declared with @var $my_var_name
	--> variable name must start with $ as in php
	--> e.g: @var $my_var_name
	
	--> tabulation and new line must be escaped like \\t and \\n

	--> if data = { age:23, nom:'toto' }
		-access to age : $.age, $['age'] or $.age
		-access to nom : $.nom, $['nom'] or $.nom

	--> if data = [23,'toto']
		-access to 23 : $[0]
		-access to 'toto' : $[1]
*/

var 
	isFunc				= function(fn){ return typeof fn === 'function';},
	isPlainObject		= function(a){  return Object.prototype.toString.apply(a) === "[object Object]"; },
	indent				= function(code,n){
							var tabs = Array(n||1).fill('\t').join('');
							return code.toString().replace(/(?:\n|\r\n)(.)/g,function(t,c){ return '\n'+tabs+(c||'')});},

	TEMP_FILE_STORE 	= {},
	//use only for debug
	OTPL_SAMPLE_FILE 	= "/*! OTpl {otpl_version} */\r\nOTpl.register({\r\n\t'version'\t\t: \"{otpl_version}\",\r\n\t'version_name'\t: \"{otpl_version_name}\",\r\n\t'src_path'\t\t: \"{otpl_src_path}\",\r\n\t'compile_time'\t: {otpl_compile_time},\r\n\t'func_name'\t\t: \"{otpl_func_name}\"\r\n},function(OTplUtils,data){\r\n\t'use strict';\r\n\treturn (function(__otpl_root){\r\n\t\t{otpl_file_content}\r\n\t})({'out':[],'data':data});\r\n});\r\n",

	OTpl_compiled		= {},
	OTpl_plugins		= {},
	OTpl_replacers		= [],
	OTpl_cleaners		= [],

	OTplUtils = {
		expose:{},
		register:function(compile_desc,fn){
	
			if( !isPlainObject(compile_desc) || !isFunc(fn) ) throw "OTpl > can't register, invalid otpl output.";

			var func_name = compile_desc.func_name;

			OTpl_compiled[func_name] = fn;
		},
		addCleaner: function(cl){
			OTpl_cleaners.push(cl);
		},
		addReplacer: function(rp){
			OTpl_replacers.push(rp);
		},
		addPlugin: function(pl_name,pl){
			OTpl_plugins[pl_name] = pl;
		},
		getCleaners: function(){
			return OTpl_cleaners;
		},
		getReplacers: function(){
			return OTpl_replacers;
		},
		getPlugins: function(){
			return OTpl_plugins;
		},
		runPlugin: function(pl_name){
			var pl = OTpl_plugins[pl_name];

			if( isFunc(pl) ){
				var args = [].slice.call(arguments,1,arguments.length);

				return pl.apply(null,args);
			}

			throw "OTpl > plugin '"+pl_name+"' not found.";
		},
		importExec: function(url,data){
			var o = OTpl_compiled[url];
			if (o instanceof OTpl) return o.runWith(data);
			else if ( isFunc(o) ) return o(OTplUtils,data);
			else throw "OTpl > '"+url+"' is required as dependance.";
		},
		loadFile: function(url) {
			if ( !(url in TEMP_FILE_STORE) ){
				if( typeof XMLHttpRequest === 'function' ){
					var xhr = new XMLHttpRequest();
					xhr.open("GET", url, false);//<-- synchrone
					xhr.send(null);

					if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
						TEMP_FILE_STORE[url] = xhr.responseText;
					} else {
						throw "OTpl > can't read file at url : "+url+" status : " + xhr.status;
					}
				} else if( isFunc(require) ) {
					var fs = require('fs');
					if( fs.existsSync(url) && fs.lstatSync(url).isFile() ){
						TEMP_FILE_STORE[url] = fs.readFileSync(url,'utf8');
					} else {
						throw "OTpl > can't read file at url : "+url;
					}
				} else {
					throw "OTpl > can't load file at url : "+url;
				}
			}

			return TEMP_FILE_STORE[url];
		},
		textToLineString: function(txt) {
			return ( '' + txt ).replace(/"/g, '\\"')
					.replace(/\t/g, '\\t')
					.replace(/\n/g, '\\n')
					.replace(/\r/g, '\\r');
		}
	};

/**START::FEATURES**/
	//./src/features/import
	(function(){
		//Ex: @import(url,data) --> OTplUtils.importExec(url,data)
		OTplUtils.addReplacer({
			reg: /@import\([\s]*?(?:'|\")(.*?)(?:'|\")(?:[\s]*,[\s]*(.+?)[\s]*)?[\s]*\)/g,
			val: function(){
				var scope = this,
					url = arguments[1],
					data = arguments[2];

				if (/\.otpl$/.test(url)){
					var child = (new OTpl()).parse(url);

					scope.addDependancies(child.getDependancies());
					scope.addDependancies([url]);

					return	"OTplUtils.importExec('"+url+"',"+data+")";
				} else {
					return "OTplUtils.loadFile('"+url+"')";
				}
			}
		});
	})();

	//./src/features/loop
	(function(){
		OTplUtils.expose.looper = function(data){
		    var i = 0,
		        len = 0,
		        keys = [],
		        arr = Array.isArray(data),
		        isPlainObject = function(a){ return Object.prototype.toString.call(a) === "[object Object]";};

		    if( !arr && !isPlainObject(data) ){
		        throw "OTpl > looper can't loop on data";
		    }

		    if(arr){
		        len = data.length;
		    } else {
		        keys = Object.keys(data);
		        len = keys.length;
		    }

		    return {
		        key:null,
		        value:null,
		        next:function(){
		            var ok = (i<len)? 1:0;
		            if(ok){
		                this.key = (arr)? i: keys[i];
		                this.value = data[this.key];
		                i++;
		            }

		            return ok;
		        }
		    };
		};

		var looper_id = 0;

		OTplUtils.addReplacer({
		    reg: /loop[\s]*\([\s]*(.+?)[\s]*\:[\s]*([$][a-zA-Z0-9_]+)[\s]*(?:\:[\s]*([$][a-zA-Z0-9_]+)[\s]*)?\)[\s]*\{/g,
		    val: function(){
		        var data = arguments[1],
		            key_name = arguments[2],
		            value_name = arguments[3],
		            __otpl_looper_n_ = "__otpl_looper_"+(++looper_id)+"_";

		        if( !(value_name === undefined) ){
		            return "for(var "+__otpl_looper_n_+" = OTplUtils.expose.looper("+data+"); "+__otpl_looper_n_+".next();){"+
		                    "\nvar "+key_name+" = "+__otpl_looper_n_+".key, "+value_name+" = "+__otpl_looper_n_+".value;";
		        } else {
		            value_name = key_name;
		            return "for(var "+__otpl_looper_n_+" = OTplUtils.expose.looper("+data+"); "+__otpl_looper_n_+".next();){"+
		                    "\nvar "+value_name+" = "+__otpl_looper_n_+".value;";
		        }
		    }
		});
	})();

	//./src/features/var
	(function(){
		//@var --> var
		OTplUtils.addCleaner({
			reg: /(?!\w)@var(\s+[$][a-zA-Z_])/g,
			val: "var$1"
		});

		//$ 	--> __otpl_root.data
		OTplUtils.addCleaner({
			reg: /(\W)\$(\W)/g,
			val: "$1__otpl_root.data$2"
		});

		OTplUtils.addCleaner({
			reg: /^\$(\W)/g,
			val: "__otpl_root.data$1"
		});

		//@fn(...) --> OTplUtils.runPlugin('fn',...)
		//shouldn't match @import(
		OTplUtils.addCleaner({
			reg: /(?!\w)@((?!import\()[a-zA-Z_][a-zA-Z0-9_]+)\(/g,
			val: "OTplUtils.runPlugin('$1',"
		});
	})();


/**END::FEATURES**/

/**START::PLUGINS**/
	//./src/plugins/assert
	(function(){
		var utils = {};

		utils.has = function(data,key,type){

			if( !data ) return false;

			if( !type && data[ key ] != undefined ) return true;
			else if( data[ key ] != undefined && utils.type( data[ key ] , type ) ) return true;
			else return false;
		};

		utils.type = function(value,type){
			var ans = false;

			switch( type ){
				case 'string':
					ans = ( typeof value === 'string') ? true:false;
				break;
				case 'list':
					var str = Object.prototype.toString.call(value);
					ans = ( str === '[object Array]' || str === '[object Object]' )? true : false ;
				break;
				case 'numeric':
					ans = !isNaN( value );
				break;
			}

			return ans;
		};

		OTplUtils.addPlugin('has',utils.has);
		OTplUtils.addPlugin('type',utils.type);
	})();

	//./src/plugins/html
	(function(){
		OTplUtils.addPlugin('HtmlSetAttr', function(key,val){
			var _ = " ",
				data = {};

			if (typeof key === 'string'){
				data[key] = val;
			} else {
				data = arguments[0];
			}

			for(var attr in data){
				var value = OTplUtils.textToLineString( data[attr] );
				_ += ' ' + attr ;

				if( value.length ){
					_ += '="' + value +'"';
				}
			}

			return _ + ' ';
		});
	})();

	//./src/plugins/utils
	(function(){
		var isArray = function(a){
			return a && Object.prototype.toString.call(a) === '[object Array]';
		};
		var isPlainObject = function(a){
			return a && Object.prototype.toString.call(a) === '[object Object]';
		};

		OTplUtils.addPlugin('join',function(items,sep){
			var s = sep || '';

			if ( isArray(items) ) {
				return items.join( s );
			}

			if( isPlainObject(items) ){
				return Object.values(items).join(s);
			}

			return "";
		});


		OTplUtils.addPlugin('concat',function(a,b){
			return [].slice.call(arguments,0,arguments.length).join('');
		});

		OTplUtils.addPlugin('length',function(a){
			if( !a ) return 0;
			if( Object.hasOwnProperty.call(a,'length') ) return a.length;

			return a;
		});

		OTplUtils.addPlugin('keys',function(a){

			if( isArray(a) || isPlainObject(a) ){
				return Object.keys(a);
			}

			return [];
		});

		OTplUtils.addPlugin('values',function(a){

			if( isArray(a) || isPlainObject(a) ){
				return Object.values(a);
			}

			return [];
		});
	})();


/**END::PLUGINS**/

	var OTpl = function () {
		var scope				= this,
		OTPL_TAG_REG			= /<%(.+?)?%>/g,
		OTPL_SCRIPT_REG			= /^(\s*)?(if|else|for|while|break|continue|switch|case|default|})/,
		OTPL_TYPE_EXPRESSION	= 0,
		OTPL_TYPE_SCRIPT		= 1;

		this.dependancies = [];

		var runReplacement = function(list,source){
			for (var i = 0; i < list.length; i++) {
				var rule = list[i],
					reg = rule['reg'],
					val = rule['val'];

				if( isFunc(val) ){
					source = source.replace(reg,function(){
						return val.apply(scope,arguments);
					});
				} else {
					source = source.replace(reg,val);
				}
			}

			return source;
		};

		var Engine = function(tpl){
			var code = "\n",
			cursor = 0, found;

			var Add = function (line, type) {
				if (line != '') {
					switch (type) {
						case OTPL_TYPE_EXPRESSION:
							code += '__otpl_root.out.push(' + line + ');\n';
							break;
						case OTPL_TYPE_SCRIPT:
							code += line + '\n';
							break;
						default:
							line = OTplUtils.textToLineString(line);
							code += '__otpl_root.out.push("' + line + '");\n';
					}
				}
			};

			while (found = OTPL_TAG_REG.exec(tpl)) {

				var source = runReplacement(OTplUtils.getCleaners(),found[1]);
					source = runReplacement(OTplUtils.getReplacers(),source);

				Add(tpl.slice(cursor, found.index));

				if (OTPL_SCRIPT_REG.test(source)) {
					Add(source, OTPL_TYPE_SCRIPT);
				} else {
					Add(source, OTPL_TYPE_EXPRESSION);
				}

				cursor = found.index + found[0].length;
			}

			Add(tpl.substr(cursor, tpl.length - cursor));

			code += 'return __otpl_root.out.join("");';

			return code;
		};

		this.parse = function(tpl){
			var isUrl = /\.otpl$/.test(tpl);//SILO::TODO not safe 

			if (isUrl){
				var obj = OTpl_compiled[tpl];
				if (obj instanceof OTpl){
					this.output = obj.getOutput();
				} else {
					this.output = Engine(OTplUtils.loadFile(tpl));
				}

				this.func_name = this.url = tpl;
				OTpl_compiled[tpl] = this;
			} else {
				this.output = Engine(tpl);
				this.func_name = (new Date()).getTime() +'_'+ Math.random();
			}

			return this;
		};
	};

	OTpl.prototype = {
		func_name:'',
		url:'inline.template.otpl',
		addDependancies: function(deps){
			for(var i = 0; i<deps.length; i++){
				var dep = deps[i];
				if( this.dependancies.indexOf(dep) < 0 ){
					this.dependancies.push(dep);
				}
			}
		},
		getDependancies:function(){
			return this.dependancies;
		},
		output:function(){ return "";},
		getOutput: function () {
			return this.output;
		},
		runWith: function (data){
			var r = {out:[],data:data};
			return (new Function('OTplUtils','__otpl_root',this.output))(OTplUtils,r);
		},
		getFnString: function(){
			var desc = {
				'{otpl_version}'		: OTpl.OTPL_VERSION,
				'{otpl_version_name}'	: OTpl.OTPL_VERSION_NAME,
				'{otpl_src_path}'		: this.url,
				'{otpl_func_name}'		: this.func_name,
				'{otpl_compile_time}'	: parseInt((new Date).getTime()/1000),
				'{otpl_file_content}'	: indent(this.getOutput(),2)
			},
			out = OTPL_SAMPLE_FILE;

			Object.keys(desc).forEach(function(key,index){
				out = out.replace( new RegExp(key,'g') , desc[key] );
			});

			return out;
		},
		exports:function(fname) {

			if (typeof module === 'object' && module.exports) {
				throw 'OTpl > exports is for test in browser only!';
			}

			var file_content = "";

			for(var i = 0; i < this.dependancies.length; i++){
				var dep = this.dependancies[i];
				var dep_obj = OTpl_compiled[dep];
				file_content += dep_obj.getFnString() + "\n";
			}

			file_content += this.getFnString();

			var b = new Blob([file_content],{type:'application/x-javascript'});

			return URL.createObjectURL(new File([b],fname));
		}
	};

	OTpl.OTPL_VERSION		= "js-1.1.2";
	OTpl.OTPL_VERSION_NAME	= "OTpl js-1.1.2";

	OTpl.register = OTplUtils.register;

	if (typeof define === 'function' && define.amd) {
		define(function () {
	  		return OTpl;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = OTpl;
	} else {
		gscope.OTpl = OTpl;
	}

}(this));