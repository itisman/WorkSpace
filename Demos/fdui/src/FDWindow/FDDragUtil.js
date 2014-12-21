/**
 * 窗体拖拽工具类
 * @example 示例:
 * // 注册
 * FDDragUtil.regist(winDom,titleDom);
 * // 取消拖拽
 * FDDragUtil.destory(titleDom);
 * @class
 */
var FDDragUtil = (function(){

	var doc = document;
	
	var moveX = 0;
	var moveY = 0;
	var moveTop = 0;
	var moveLeft = 0;
	var moveable = false;
	
	return {
		/**
		 * 注册拖拽
		 * 需要传入整个窗体dom和标题部分的dom
		 */
		regist:function(winDom,titleDom) {	
			var width = doc.body.clientWidth; 
			var height = doc.body.clientHeight;
			var title = titleDom;
			var win = winDom;
			var winStyle = win.style;
			title.style.cursor = 'move';

			title.onmousedown = function() {
				var evt = FDDragUtil._getEvent();	
				
				moveable = true; 
				moveX = evt.clientX;
				moveY = evt.clientY;
				
				moveTop = parseInt(winStyle.top);
				moveLeft = parseInt(winStyle.left);
				
				doc.onmousemove = function() {
					if (moveable) {
						var evt = FDDragUtil._getEvent();
						var x = moveLeft + evt.clientX - moveX;							
						var y = moveTop + evt.clientY - moveY;
						if ( x > 0 && y > 0) {
							winStyle.left = x + "px";
							winStyle.top = y + "px";
						}
					}	
				};
				doc.onmouseup = function () { 
					if (moveable) { 					
						moveable = false; 
						moveX = 0;
						moveY = 0;
						moveTop = 0;
						moveLeft = 0;
					} 
				};
			}
		}
		,moveToCenter:function(win) {
			var body = doc.body
				,docEl = doc.documentElement;
				
			var clientHeight = docEl.clientHeight || body.clientHeight
				,clientWidth = docEl.clientWidth || body.clientWidth
				,scrollTop = docEl.scrollTop || body.scrollTop 
				,scrollLeft = docEl.scrollLeft || body.scrollLeft 
				,left = clientWidth * 0.35 + scrollLeft
				,top = clientHeight * 0.25 + scrollTop;
				
			win.style.left = left + 'px';
       	 	win.style.top = top + 'px'; 
		}
		/**
		 * 注销,取消拖拽
		 */
		,destory:function(titleDom) {
			titleDom.style.cursor = 'default';
			titleDom.onmousedown = null;
		}
		/**
		 * 获取事件
		 */
		,_getEvent:function(){
			 return window.event || arguments.callee.caller.arguments[0];
		}
	}
})();