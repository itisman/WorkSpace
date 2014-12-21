/**
 * 验证数字的validate,继承自<a href="FDBaseValidate.html">FDBaseValidate</a><br>
 * @example 示例:
var controls
window.onload = function() {
	controls = [
		new FDTextBox({domId:'t1',label:'验证正整数:',validates:[new FDValidate({errorMsg:'请输入正整数',successMsg:'验证成功',items:['positiveInt']})]})
		,new FDTextBox({domId:'t2',label:'验证自然数:',validates:
				[
				 new FDValidate({errorMsg:'请输入自然数',items:['naturalNum']})
				 ,new FDValidate({minLength:4,maxLength:10})
				]})
		,new FDTextBox({domId:'t3',label:'验证正数:',validates:[new FDValidate({errorMsg:'请输入大于零的数',label:'文本框',notNull:true,items:['positiveNum']})]})
		,new FDTextBox({domId:'t4',label:'验证浮点数:',validates:[new FDValidate({errorMsg:'请输入浮点数',label:'浮点数',notNull:true,items:['floatNum']})]})
		,new FDTextBox({domId:'t5',label:'验证正浮点数:',validates:[new FDValidate({errorMsg:'请输入正浮点数',label:'正浮点数',items:['positiveFloatNum']})]})
		,new FDTextBox({domId:'t6',label:'验证非负浮点数:',validates:[new FDValidate({errorMsg:'请输入非负浮点数',label:'非负浮点数',items:['notNegativeFloatNum']})]})
		,new FDTextBox({domId:'t7',label:'验证邮箱:',validates:[new FDValidate({errorMsg:'请输入正确的邮箱',label:'邮箱',items:['email']})]})
		,new FDTextBox({domId:'t8',label:'验证手机号:',validates:[new FDValidate({errorMsg:'请输入正确的手机号',label:'手机号',items:['mobile']})]})
		,new FDTextBox({domId:'t9',label:'验证电话:',validates:[new FDValidate({errorMsg:'请输入正确的电话号',label:'手机号',items:['tel']})]})
	]
}
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-7-31
 */
var FDValidate = function(options) {
	FDValidate.superclass.constructor.call(this,options);
}

FDLib.extend(FDValidate,FDBaseValidate);

/**
 * 验证
 * @param val 控件的值
 */
FDValidate.prototype.validate = function(val) {
	// 检测空值
	var len = this.getValueLength(val);
	if(len === 0) {
		if(this.options.notNull) {
			this.msgDom.innerHTML = this.options.label + '不能为空';
			return false;
		}
		return true;
	}
	// 检测长度
	var lenVal = this.validateLength(val);
	if(!lenVal) {
		return false;
	}
	
	var itemsValue = this.validateItems(val);
	if(!itemsValue) {
		return false;
	}
	// 验证成功
	this.msgDom.innerHTML = this.options.successMsg || '';
	return true;
}

/**
 * 验证长度
 * @private
 */
FDValidate.prototype.validateLength = function(val) {
	var len = this.getValueLength(val);
	var mixLen = this.options.minLength || -1;
	var maxLen = this.options.maxLength || -1;
	if(mixLen !== -1) {
		if(len < mixLen) {
			this.msgDom.innerHTML = this.options.label + '最小长度不得小于' + mixLen;
			return false;
		}
	}
	
	if(maxLen !== -1) {
		if(len > maxLen) {
			this.msgDom.innerHTML = this.options.label + '最大长度不得大于' + maxLen;
			return false;
		}
	}
	
	return true;
}

/**
 * @private
 */
FDValidate.prototype.validateItems = function(val) {
	var items = this.options.items || [];
	var validateMap = FDValidateStore;
	
	for(var i=0,len=items.length; i<len; i++) {
		var validateItem = items[i];
		var validateHandler = validateMap[validateItem];
		
		if(!FDLib.util.isFunction(validateHandler)) {
			throw new Error('验证项[ ' + validateItem) + ' ]不存在';
		}
		// 验证不通过
		if(!validateHandler(val)) {
			this.msgDom.innerHTML = this.options.errorMsg;
			return false;
		}
	}
	return true;
}

