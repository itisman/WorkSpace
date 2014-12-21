/**
 * form组件的父类,提供默认的属性,和方法
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDComponent = function(options) {
	FDLib.implement(this,FDControl);
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	this.outerDiv = document.createElement(FDTag.DIV);
	this.hide();
	
	if(FDLib.util.isString(this.options.domId)) {
		this.renderTo(this.options.domId);
	}
}

FDComponent.prototype = {
/**
 * 获取组件的默认属性
   @return <pre><code>返回json数据类型
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:null
			,label:""
			,labelAlign:'right'
			,labelValign:'middle'
			,name:""
			,width:""
			,height:""
			,validates:[]
		};
	}
	/**
	 * 显示控件
	 */
	,show:function() {
		this.outerDiv.style.display = "inline-block";
	}
	/**
	 * 隐藏控件
	 */
	,hide:function() {
		this.outerDiv.style.display = "none";
	}
	/**
	 * 设置控件样式
	 * @param style className,字符串格式
	 */
	,setStyle:function(style) {
		if(FDLib.util.isString(style)) {
			this.outerDiv.className = style;
		} 
	}
	/**
	 * 设置控件样式,作用同setStyle
	 * @param className className,字符串格式
	 */
	,setClass:function(className) {
		this.setStyle(className);
	}
	/**
	 * 添加控件样式.<br>
	 * <b>注:此样式添加在控件的最外层的div上</b>
	 * @param className className,字符串格式
	 */
	,addClass:function(className) {
		FDLib.dom.addClass(this.outerDiv,className);
	}
	/**
	 * 移除控件样式
	 * @param className className,字符串格式
	 */
	,removeClass:function(className) {
		FDLib.dom.removeClass(this.outerDiv,className);
	}
};

