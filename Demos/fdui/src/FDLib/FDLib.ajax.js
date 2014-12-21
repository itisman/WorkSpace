/**
 * Ajax工具类
 * @class
 */
FDLib.ajax = {
	/**
	 * 提交请求
	 * @param options
	 * { url:'',params:{},success:function(){} }
	 */
	request:function(options) {
		var url = options.url;
		var params = options.params || {};
		var callback = options.success || function(){};
		
		var xhr = this.createXhrObject();
		
		xhr.onreadystatechange = function() {
			if(xhr.readyState !== 4) {
				return;
			}
			if(xhr.status === 200 || xhr.status === 0) {
				callback(xhr.responseText)
			} else {
				throw new Error('请求失败:' + xhr.responseText);
			}
		};
		
		xhr.open('POST',url,false);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(this._formatParamsToArr(params) || null);
	}
	,_formatParamsToArr:function(params) {
		var retArr = [];
		for(var key in params) {
			var val = params[key];
			var para = key + "=" + val;
			if(this._isArray(val)) {
				para = this._formatArrParam(key,val);
			}
			if(para) {
				retArr.push(para);
			}
		}
		if(retArr.length == 0) {
			return '';
		}
		return retArr.join('&');
	}
	// 将数组转换成键值格式
	//  id:[1,2,3] --> id=1&id=2&id=3
	,_formatArrParam:function(key,vals) {
		if(vals.length == 0) {
			return '';
		}
		var ret = [];
		for(var i=0,len=vals.length; i<len; i++) {
			ret.push(key + "=" + vals[i]);
		}
		return ret.join('&');
	}
	,_isArray:function(o) {
		return Object.prototype.toString.apply(o)
			=== '[object Array]';
	}
	/**
	 * 创建XHR对象
	 * @private
	 */
	,createXhrObject:function() {
		var methods = [
			function(){ return new XMLHttpRequest();}
			,function(){ return new ActiveXObject('Msxml2.XMLHTTP');}
			,function(){ return new ActiveXObject('Microsoft.XMLHTTP');}
		];
		
		for(var i=0,len=methods.length; i<len; i++) {
			try {
				methods[i]();
			} catch (e) {
				continue;
			}
			
			this.createXhrObject = methods[i];
			return methods[i]();
		}
		
		throw new Error("创建XHR对象失败");
	}
};

