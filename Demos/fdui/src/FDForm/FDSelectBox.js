/**
 * 选择框类FDSelectBox,继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
 * <pre></code>
var select1;
var select2;

var genderItems = [{value:1,text:"男"},{value:0,text:"女"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

window.onload = function() {
	select1 = new FDSelectBox({name:"gender",items:genderItems});
	select1.renderTo('gender');
	
	select2 = new FDSelectBox({domId:'constellation',name:'constellation',items:constellationItems,label:'星坐:'});
}</code></pre>
 * 2012-8-1
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDSelectBox = function(options) {
	FDSelectBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDSelectBox,FDItemComponent);

/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
 * {
 *  domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] 
	// 是否显示默认选项
	,isShowDefaultItem:true
	// 默认选项的文本
	,defaultItemText:'-请选择-'
	// 默认选项的值
	,defaultItemValue:''
	,defaultValue:''
 * }</code></pre>
 */
//@override
FDSelectBox.prototype.getOptions = function() {
	var options = FDSelectBox.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 是否显示默认选项
		isShowDefaultItem:true
		// 默认选项的文本
		,defaultItemText:'-请选择-'
		// 默认选项的值
		,defaultItemValue:''
		,defaultValue:''
	});
}

/**
 * @private
 */
// 重写父类的方法
//@override
FDSelectBox.prototype.buildItemsHtml = function() {
	var name = this.options.name,
		id = name + "_id";
		
	var selectStr = '<select id="'+id+'" name="'+name+'">'
		+ this._getSelectItems() + '</select>';
		
	return selectStr;
}

FDSelectBox.prototype._getSelectItems = function() {
	var defItemHtml = this._buildDefaultItem();
	// 调用父类的buildItemsHtml方法
	var itemsHtml = FDSelectBox.superclass.buildItemsHtml.call(this);
	
	return defItemHtml + itemsHtml;
}

FDSelectBox.prototype._buildDefaultItem = function() {
	var defItem = '';
	
	if(this.options.isShowDefaultItem) {
		var value = this.options.defaultItemValue;
			text = this.options.defaultItemText
		defItem = '<option value="'+value+'">'+text+'</option>';
	}
	return defItem;
}

/**
 * @private
 */
//@override
FDSelectBox.prototype.getItemTemplate = function() {
	return '<option value="{value}">{text}</option>';
}

/**
 * @private
 */
// 重写父类的方法
//@override
FDSelectBox.prototype.getControlItems = function() {
	return this.controlDiv.getElementsByTagName('select');
}
