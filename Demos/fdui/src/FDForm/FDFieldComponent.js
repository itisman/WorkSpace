/**
 * 具有值域的控件,继承自<a href="FDComponent.html">FDComponent</a><br>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDFieldComponent = function(optoins) {
	FDFieldComponent.superclass.constructor.call(this,optoins);
	FDLib.implement(this,FDField);
	// 确保name完整性
	this.options.name = this.options.name || "name_" + FDControl.generateCount();
	// 存放form控件的div,如input,textarea
	this.controlDiv = document.createElement(FDTag.DIV);
	
	this.msgId = this.options.name + "_msg";
	this.msgDom;
	
	this._buildFormElHtml();
	this._buildContent();
	
	this.setBounds(this.options.width,this.options.height);
	
	this.setStyle('fdform');
	
	this.reset();
	
	this.show();
}

FDLib.extend(FDFieldComponent,FDComponent);

// abstract 需要子类重写
FDFieldComponent.prototype.getControlHtml = null;

/**
 * 覆盖父类方法,获取组件的默认属性
   @return 返回json数据类型<pre><code>
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,defaultValue:'' // 默认值
}</code></pre>
 */
//@override
FDFieldComponent.prototype.getOptions = function() {
	var options = FDFieldComponent.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 默认值
		defaultValue:''
	});
}

/**
 * 添加事件
 * @param eventType 事件类型,如:click,change,mouseover
 * @param eventHandler 事件函数
 */
FDFieldComponent.prototype.addEvent = function(eventType,eventHandler) {
	var event = FDLib.event;
	FDLib.util.each(this.getControlItems(),function(control){
		event.addEvent(control,eventType,eventHandler);
	});
}

/**
 * 设置事件
 * @param eventType 事件类型,如:click,change,mouseover
 * @param eventHandler 事件函数
 */
FDFieldComponent.prototype.setEvent = function(eventType,eventHandler) {
	var event = FDLib.event;
	FDLib.util.each(this.getControlItems(),function(control){
		event.setEvent(control,eventType,eventHandler);
	});
}

/**
 * 移除事件
 * @param eventType 事件类型,如:click,change,mouseover
 * @param eventHandler 事件函数
 */
FDFieldComponent.prototype.removeEvent = function(eventType,eventHandler) {
	var event = FDLib.event;
	FDLib.util.each(this.getControlItems(),function(control){
		event.removeEvent(control,eventType,eventHandler);
	});
}

/**
 * 禁用控件
 */
FDFieldComponent.prototype.disable = function() {
	FDLib.util.each(this.getControlItems(),function(control){
		control.disabled = "disabled";
	});
}

/**
 * 启用控件
 */
FDFieldComponent.prototype.enable = function() {
	FDLib.util.each(this.getControlItems(),function(control){
		control.disabled = "";
	});
}

/**
 * 将控件定位到HTML中
 * @param _domId html中元素的id
 */
FDFieldComponent.prototype.renderTo = function(_domId) {
	var dom = FDLib.getEl(_domId) || document.body;
	this.renderToDom(dom);
}

/**
 * 将控件定位到HTML中
 * @param dom DOM对象
 */
FDFieldComponent.prototype.renderToDom = function(dom) {
	dom.appendChild(this.outerDiv);
}

/**
 * 获取所有的input控件,如果要获取其它控件则需要重写该方法
 */
FDFieldComponent.prototype.getControlItems = function() {
	return this.controlDiv.getElementsByTagName('input');
}

/**
 * 获取控件的值
 * 注:这里默认获取单个值,如:radio,selectbox,textbox
 * 获取多个值需要在子类中重写
 */
FDFieldComponent.prototype.getValue = function() {
	return this.getControlItems()[0].value;
}

/**
 * 设置控件的值
 * 注:这里默认设置单个值,如:radio,selectbox,textbox
 * 设置多个值需要在子类中重写
 */
FDFieldComponent.prototype.setValue = function(val) {
	if(val !== undefined) {
		this.getControlItems()[0].value = val;
	}
}

/**
 * 返回控件json数据
 * @return 单个值返回name/value键值对,多个值返回name/[]键值对
 */
FDFieldComponent.prototype.getData = function() {
	var name = this.options.name;
	var data = {};
	data[name] = this.getValue();
	return data;
}

/**
 * 设置控件的name
 */
FDFieldComponent.prototype.setName = function(name) {
	if(FDLib.util.isString(name)) {
		this.options.name = name;
	}
}

/**
 * 返回控件的name
 * @param 返回name属性,字符串类型
 */
FDFieldComponent.prototype.getName = function() {
	return this.options.name;
}

/**
 * 重置控件的值
 */
FDFieldComponent.prototype.reset = function() {
	var defaultValue = this.options.defaultValue;
	if(FDLib.util.isNull(defaultValue)) {
		return;
	}
	this.setValue(defaultValue);
	this.setMsgText('');
}

/**
 * 设置控件的提示信息样式
 * @param style className
 */
FDFieldComponent.prototype.setMsgStyle = function(style) {
	this.msgDom.className = style;
}

/**
 * 设置控件的提示信息
 */
FDFieldComponent.prototype.setMsgText = function(val) {
	this.msgDom.innerHTML = val;
}

/**
 * 设置宽
 */
FDFieldComponent.prototype.setWidth = function(width) {
	width = FDLib.util.formatSize(width || '');
	if(width) {
		FDLib.util.each(this.getControlItems(),function(control){
			control.style.width = width + 'px';
		});
	}
}

/**
 * 设置高
 */
FDFieldComponent.prototype.setHeight = function(height) {
	height = FDLib.util.formatSize(height || '');
	if(height) {
		FDLib.util.each(this.getControlItems(),function(control){
			control.style.height = height + 'px';
		});
	}
}

/**
 * 设置宽和高
 */
FDFieldComponent.prototype.setBounds = function(width,height) {
	this.setWidth(width);
	this.setHeight(height);
}

/**
 * 构建控件内容
 * 格式:
 * ┏━━━━━━━━━━━━━━┓
 * ┃姓名:┃ 控件部分 ┃提示信息 ┃
 * ┗━━━━━━━━━━━━━━┛
 * @private
 */
FDFieldComponent.prototype._buildContent = function() {
	var table = document.createElement(FDTag.TABLE);
	var tbody = document.createElement(FDTag.TBODY);
	table.appendChild(tbody);
	
	var tr = tbody.insertRow(0);
	var cellIndex = 0;
	
	if(this.options.label && FDLib.util.isString(this.options.label)) {
		this._buildLabelTD(tr,cellIndex++);
	}
	this._buildFormElTD(tr,cellIndex++);
	this._buildMsgTD(tr,cellIndex++);
	
	this.outerDiv.appendChild(table);
}

FDFieldComponent.prototype._buildLabelTD = function(tr,cellIndex) {
	var tdLabel = tr.insertCell(cellIndex);
	tdLabel.className = 'lab';
	tdLabel.align = this.options.labelAlign;
	tdLabel.vAlign = this.options.labelValign;
	
	tdLabel.innerHTML = this.options.label;
}

FDFieldComponent.prototype._buildFormElTD = function(tr,cellIndex) {
	var tdFormEl = tr.insertCell(cellIndex);
	tdFormEl.appendChild(this.controlDiv);
}

/**
 * 初始化控件内容
 * @private
 */
FDFieldComponent.prototype._buildFormElHtml = function() {
	this.controlDiv.innerHTML = this.getControlHtml();
}

FDFieldComponent.prototype._buildMsgTD = function(tr,cellIndex) {
	var tdMsg = tr.insertCell(cellIndex);
	this.msgDom = document.createElement(FDTag.DIV);
	this.msgDom.className = "msg";
	this.msgDom.id = this.msgId;
	tdMsg.appendChild(this.msgDom);
}

/**
 * 验证
 */
FDFieldComponent.prototype.validate = function() {
	var value = this.getValue();
	var validates = this.options.validates || [];
	
	for(var i=0,len=validates.length; i<len; i++) {
		var validate = validates[i];
		validate.setMsgId(this.msgId);
		var val = validate.validate(value);
		if(!val) {
			return false;
		}
	}
	return true;
}

