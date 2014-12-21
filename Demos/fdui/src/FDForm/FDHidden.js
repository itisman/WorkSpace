/**
 * 文本框控件FDTextBox,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
var hidden1;

window.onload = function() {
	hidden1 = new FDHidden({name:"username",defaultValue:'请输入姓名'});
	hidden1.renderTo('username');
}
</code></pre>
* @param options 参见<a href="FDFieldComponent.html#getOptions">FDFieldComponent.getOptions()</a><br>
* @constructor
 */
var FDHidden = function(options) {
	FDHidden.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDHidden,FDFieldComponent);

/**
 * @private
 */
//@override
FDHidden.prototype.getControlHtml = function() {
	return '<input type="hidden" name="'+this.options.name+'" />';
}

// 重写方法
// hidden控件不需要这些方法
FDHidden.prototype.hide = 
FDHidden.prototype.show = 
FDHidden.prototype.enable = 
FDHidden.prototype.disable = function(){};
