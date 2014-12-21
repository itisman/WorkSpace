/**
 * HTML节点工具类
 * @class
 */
FDLib.dom = {
	/**
	 * 包裹节点,相当于jquery的warp
	 * @param target dom对象
	 * @param html 可以是dom对象也可以是string
	 */
	wrap:function(target,html) {
		var wrap = html;
		if(FDLib.util.isString(html)) {
			if(document.createRange) {
				var range = document.createRange();
	      		range.selectNodeContents(target);
	      		wrap = range.createContextualFragment(html).firstChild;
			} else {
		    	wrap = document.createElement(html);
		    }
		}
		target.parentNode.replaceChild(wrap,target);
		wrap.appendChild(target);
		
		return wrap;
	}
	/**
	 * 隐藏节点
	 * @param dom DOM对象
	 */
	,hideDom:function(dom) {
		dom.style.display = "none";
	}
	/**
	 * 显示节点
	 * @param dom DOM对象
	 */
	,showDom:function(dom) {
		dom.style.display = "block";
	}
	/**
	 * 添加元素的class属性
	 * @param dom DOM对象,如input,div等
	 * @param classNames class名,字符串格式,多个用空格隔开.如:"enable","enable selected"
	 */
	,addClass:function(dom,classNames) {
		var classNameArr = (classNames || "").split(/\s+/);
		for(var i=0,len=classNameArr.length; i<len; i++) {
			var className = classNameArr[i];
			if(dom.nodeType == 1 && !this.hasClass(dom,className)) {
				dom.className += (dom.className ? " " : "") + className;
			}
		}
	}
	/**
	 * 移除元素的class属性
	 * @param dom DOM对象,如input,div等
	 * @param className class名,字符串格式,多个用空格隔开.如:"enable","enable selected"
	 */
	,removeClass:function(dom,classNames) {
		if(dom.nodeType == 1) {
			var classNameArr = (classNames || "").split(/\s+/);
			var domClasses = (dom.className).toString().split(/\s+/);
			for(var i=0,len=classNameArr.length; i<len; i++) {
				var className = classNameArr[i];
				for(var j=0,len2=domClasses.length; j<len2; j++) {
					if(domClasses[j] == className) {
						domClasses[j] = '';
					}
				}
			}
			dom.className = domClasses.join(' ');
		}
	}
	/**
	 * 判断DOM是否含有className
	 * @param dom DOM 对象
	 * @param className 字符串格式
	 */
	,hasClass:function(dom,className) {
		var classNameArr = (dom.className).toString().split(/\s+/);
		for(var i=0,len=classNameArr.length; i<len; i++) {
			if(classNameArr[i] == className) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 给DOM对象绑定style
	 * @param dom DOM对象
	 * @param styleJson 存放样式,如:{'backgroundColor':'red','border':'1px'};采用驼峰式写法
	 */
	,bindDomStyle:function(dom,styleJson) {
		for(var styleName in styleJson) {
			dom.style[styleName] = styleJson[styleName];
		}
	}
	/**
	 * 获取元素距离页面左边的值,相当于jquery中的offset().left
	 * @return 返回int类型的值
	 */
	,getOffsetX:function(element) {
		var actualLeft = element.offsetLeft;
		var current = element.offsetParent;
	
		while (current !== null){
			actualLeft += current.offsetLeft;
			current = current.offsetParent;
		}
	
		if (document.compatMode == "BackCompat"){
			var elementScrollLeft = document.body.scrollLeft;
		} else {
			var elementScrollLeft = document.documentElement.scrollLeft; 
		}
	
		return actualLeft - elementScrollLeft;
	}
	/**
	 * 获取元素距离页面顶部的值,相当于jquery中的offset().top
	 * @return 返回int类型的值
	 */
	,getOffsetY:function(element) {
		var actualTop = element.offsetTop;
		var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current. offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　 if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollTop = document.body.scrollTop;
　　　　} else {
　　　　　　var elementScrollTop = document.documentElement.scrollTop; 
　　　　}

　　　　return actualTop - elementScrollTop;
	}
	/**
	 * 等同于jquery.offset()
	 * @return 返回 {letf:int,top:int}
	 */
	,getOffset:function(dom) {
		return {left:this.getOffsetX(dom),top:this.getOffsetY(dom)};
	}
};
