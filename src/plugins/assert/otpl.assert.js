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