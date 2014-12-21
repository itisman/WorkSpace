/**
 * 文本框控件FDTextBox,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
var txtUsername;

window.onload = function() {
	txtUsername = new FDTextBox({name:"username",defaultValue:'请输入姓名'
		,validates:[new FDValidate({errorMsg:'请输入正整数',items:['positiveInt']})]});
	txtUsername.renderTo('username');
	
	var text2 = new FDTextBox({domId:'addr',width:200,height:30,name:'addr',label:'地址:',labelValign:'top'});
	text2.addEvent('change',function(){
		var e = FDLib.event.getEvent();
		alert(e.target.value);
	})
}</code></pre>
* @param options 参见<a href="FDFieldComponent.html#getOptions">FDFieldComponent.getOptions()</a><br>
* @constructor
 */
var FDTextBox = function(options) {
	FDTextBox.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDTextBox,FDFieldComponent);

/**
 * @private
 */
//@override
FDTextBox.prototype.getControlHtml = function() {
	return '<input type="text" name="'+this.options.name+'" />';
}
