/**
 * 文本框控件FDButton,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
var btn1;

window.onload = function() {
	btn1 = new FDButton({domId:'btn1',text:'按钮文本',onclick:function(){
		alert(1)
	}});
}

function setOnclickEvent() {
	btn1.setOnclick(function(){
		alert(2);
	})
}
function setText() {
	btn1.setText('按钮aaa')
}</code></pre>
* @param options 参见<a href="#getOptions">getOptions()</a><br>
* @constructor
 */
var FDButton = function(options) {
	FDButton.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	this.setOnclick(this.options.onclick);
	this.setValue(this.options.text);
	
	this._initEvent();
	
	this.enable();
}

FDLib.extend(FDButton,FDFieldComponent);

/**
 * 返回默认属性
 * @return <pre><code>
{
	// 按钮文本
	text:''
	// 事件函数
	,onclick:null
}</code></pre>
 */
FDButton.prototype.getOptions = function() {
	var options = FDButton.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		text:''
		,onclick:null
	});
}

/**
 * 设置onclick事件
 * @param onclick 事件函数
 */
FDButton.prototype.setOnclick = function(onclick) {
	this.removeEvent('click',this.options.onclick);
	this.addEvent('click',onclick);
	this.options.onclick = onclick;
}

/**
 * 设置按钮文本
 * @param text 按钮文本
 */
FDButton.prototype.setText= function(text) {
	this.setValue(text);
}

/**
 * 禁用控件
 */
// @override
FDButton.prototype.enable = function() {
	FDButton.superclass.enable.call(this);
	this.setStyle('fdbutton fdbutton-enable');
}

/**
 * 启用控件
 */
// @override
FDButton.prototype.disable = function() {
	FDButton.superclass.disable.call(this);
	this.setStyle('fdbutton fdbutton-disable');
}

/**
 * @private
 */
//@override
FDButton.prototype.getControlHtml = function() {
	return '<input type="button" />';
}

FDButton.prototype._initEvent = function() {
	var self = this;
	
	this.addEvent('mouseover',function(){
		self.setStyle('fdbutton fdbutton-hover')
	});
	this.addEvent('mouseout',function(){
		self.setStyle('fdbutton fdbutton-enable')
	});
}
