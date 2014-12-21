/**
 * tip工具类,用于批量创建tip,提高性能
 * @example 使用方法:
 * var dom = document.getElementById("id");
 * var text = "提示层的内容";
 * FDTipUtil.addTip(dom,text);
 * @class
 */
var FDTipUtil = (function(){
	
	var instance = null;
	var event = FDLib.event;
	
	function getInstance() {
		if(!instance) {
			instance = new FDTip();
		}
		return instance;
	}
	
	return {
		/**
		 * 添加tip,如果不传text则默认取dom的title
		 */
		addTip:function(dom,text) {
			if(!dom) {
				throw new Error('请传入正确的dom对象')
			}
			var tip = getInstance();
			event.addEvent(dom,'mouseover',function(){
				var e = event.getEvent();
				tip.show(e,text);
			});
			event.addEvent(dom,'mousemove',function(){
				var e = event.getEvent();
				tip.setXY(e.pageX,e.pageY);
			});
			event.addEvent(dom,'mouseout',function(){
				tip.hide();
			})
		}
	};
	
})();
