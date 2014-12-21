/**
 * 验证控件的基类
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDBaseValidate = function(options) {
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.msgDom = FDLib.getEl(this.options.msgId) || null;
}

FDBaseValidate.prototype = {
/**
 *返回默认属性 
 *<pre><code>
{
	// 最小长度 
	minLength:-1
	// 最大长度 
	,maxLength:-1
	// 提示标签,如XX不能为空
	,label:''
	// 不能为空
	,notNull:false
	// 错误信息
	,errorMsg:''
	// 成功信息
	,successMsg:''
	// 消息节点ID
	,msgId:''
	// 验证规则
	,validateItems:[]
}</code></pre>
 */
	getOptions:function() {
		return {
			/** 最小长度*/
			minLength:-1
			/** 最大长度*/
			,maxLength:-1
			,label:''
			,notNull:false
			,errorMsg:''
			,successMsg:''
			,msgId:''
			,validateItems:[]
		};
	}
	/**
	 * 设置提示信息的id
	 */
	,setMsgId:function(id){
		this.options.msgId = id;
		this.msgDom = FDLib.getEl(id);
	}
	/**
	 * 验证操作
	 */
	,validate:function(){
		return true;
	}
	/**
	 * 返回字节长度,一个汉字返回2个长度
	 */
	,getValueLength:function(value) {
		var util = FDLib.util;
		if(util.isUndefined(value)) {
			return 0;
		}
		if(util.isArray(value) && value.length === 0) {
			return 0;
		}
		return (value + '').replace(/[^\x00-\xff]/g, "**").length;
	}
}

