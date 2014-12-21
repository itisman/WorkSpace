/**
 * 日历控件FDDatePick继承自<a href="FDTextBox.html">FDTextBox</a><br>
 * @example 示例:
 * <pre><code>
window.onload = function() {
	datepick1 = new FDDatePick({domId:'datepick1',name:"datepick1"
		,validates:[ new FDValidate({notNull:true}) ]});
	new FDDatePick({domId:'datepick2',label:'时间:',name:"datepick2",isShowTime:true,format:FDCalendar.FORMAT_YMDHMS});
}
 * </code></pre>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDDatePick = function(options) {
	FDDatePick.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.calendar = new FDCalendar(this.options);
	
	this._registCalendar();
	this.calendar._runOnclearHandler();
	
	this.addClass('fddatepick');
}

FDLib.extend(FDDatePick, FDTextBox);

/**
 * 返回日历的默认属性
 * @return <pre><code>
{
	value:''
	// 点击日期触发的事件
	,onclick:function(value,target,cal){
		self.setValue(value);
		self.getControlItems()[0].className = '';
		cal.hide();
	}
	// 清空操作时触发的事件 
	,onclear:function(value,target,cal) {
		self.setValue(self.options.defaultValue);
		self.getControlItems()[0].className = 'default';
		cal.hide();
	}
	// 是否显示时间选择器
	,isShowTime:false
	// 日期格式
	,format:FDCalendar.FORMAT_YMD
	,defaultValue:'- 点击选择时间 -'
}</code></pre>
 */
//@override
FDDatePick.prototype.getOptions = function() {
	var self = this;
	var options = FDDatePick.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		value:''
		,onclick:function(value,target,cal){
			self.setValue(value);
			cal.hide();
		}
		,onclear:function(value,target,cal) {
			self.setValue(self.options.defaultValue);
			self.getControlItems()[0].className = 'default';
			cal.hide();
		}
		,isShowTime:false
		,offsetY:19
		,format:FDCalendar.FORMAT_YMD
		,defaultValue:'- 点击选择时间 -'
	});
}

FDDatePick.prototype._registCalendar = function() {
	var self = this;
	var calObj = this.calendar;
	var targetDom = calObj.getCalendarDom();
	var dom = this.getControlItems()[0];
	var event = FDLib.event;
	
	this.addEvent('click',function(){
		var e = event.getEvent();
		calObj.show(e.target,self.getValue());
	});
	
	// 点击其它地方隐藏
	event.addEvent(document,'click',function(){
		var e = event.getEvent();
	    var elem = e.target
	    if(dom.disabled) {
	    	return;
	    }
	    while (elem) {  
	        if (elem != document) {  
	            if (elem === targetDom || elem === dom) {  
	                targetDom.style.display = "block";
	                return;  
	            }  
	            elem = elem.parentNode;  
	        } else {  
	            targetDom.style.display = "none";
	            return;  
	        }  
	    }  
	});
}

/**
 * 重写父类方法,返回控件的html格式
 * @private
 */
//@override
FDDatePick.prototype.getControlHtml = function() {
	var opt = this.options;
	var value = 'value="' + opt.defaultValue + '"';
	return '<input type="text" title="点击选择时间" readonly="readonly" name="' + opt.name + '" '+value+'/>';
}

/**
 * 设置日期
 */
FDDatePick.prototype.setValue = function(val) {
	var isDateStr = FDLib.date.isDateStr(val);
	
	if(isDateStr) {
		FDDatePick.superclass.setValue.call(this,val);
		this.getControlItems()[0].className = '';
	}else{
		FDDatePick.superclass.setValue.call(this,this.options.defaultValue);
		this.getControlItems()[0].className = 'default';
	}
}

/**
 * 获取日期
 * @return 返回字符串日期
 */
//@override
FDDatePick.prototype.getValue = function() {
	var value = FDDatePick.superclass.getValue.call(this);
	return FDLib.date.isDateStr(value) ? value : '';
}

/**
 * 禁用控件
 */
// @override
FDDatePick.prototype.disable = function() {
	FDDatePick.superclass.disable.call(this);
	this.getControlItems()[0].title = '';
	this.addClass('fddatepick-disable');
}

/**
 * 启用控件
 */
// @override
FDDatePick.prototype.enable = function() {
	FDDatePick.superclass.enable.call(this);
	this.getControlItems()[0].title = '点击选择时间';
	this.removeClass('fddatepick-disable');
}

