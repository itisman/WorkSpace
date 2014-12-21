/**
 * 密码输入框类,继承自<a href="FDTextBox.html">FDTextBox</a><br>
 * @example 示例:
 * <pre><code>
 * var txtPassword = new FDPasswordBox({domId:'password',name:'password',label:'密码:'});
 * </code></pre>
 * @constructor
 */
var FDPasswordBox = function(options) {
	FDPasswordBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDPasswordBox,FDTextBox);

/**
 * 返回密码控件的html
 * @private
 */
//@override
FDPasswordBox.prototype.getControlHtml = function() {
	return '<input type="password" name="' + this.options.name + '" />';
}

