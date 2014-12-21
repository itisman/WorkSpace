/**
 * 浏览器工具类
 * @class
 */
FDLib.browser = (function(){
	var ua = navigator.userAgent.toLowerCase();
	/**
	 * @private
	 */
	var check = function(r){
		return r.test(ua);
	}
	
	var b = {
		/**
		 * 是否为Opera浏览器
		 * @return true,是
		 */
		isOpera : function(){return check(/opera/) }
		/**
		 * 是否为IE浏览器
		 * @return true,是
		 */
		,isIE : function(){return !b.isOpera() && check(/msie/) }
		/**
		 * 是否为windows操作系统
		 * @return true,是
		 */
		,isWin :function(){return check(/windows|win32/) }
	};
	
	return b;
})();

