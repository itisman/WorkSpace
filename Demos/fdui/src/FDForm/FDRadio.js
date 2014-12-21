/**
 * 单选框FDRadio,继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
<pre><code>
var radio1;
var radio2;

var genderItems = [{value:1,text:"男"},{value:0,text:"女"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

var newItems = [
{value:10,text:'北京'},{value:11,text:'上海'},{value:12,text:'天津'}
,{value:13,text:'重庆'}
                ];
                
window.onload = function() {
	radio1 = new FDRadio({name:"gender",items:genderItems
		,validates:[ new FDValidate({notNull:true}) ]
	});
	radio1.renderTo('gender');
	
	radio2 = new FDRadio({domId:'constellation',name:'constellation'
		,defaultValue:1
		,items:constellationItems,label:'星坐:'});
}</code></pre>
 * 2012-8-1
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDRadio = function(options) {
	FDRadio.superclass.constructor.call(this,options);
}

FDLib.extend(FDRadio,FDItemComponent);
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
	// 垂直排放
	,vertical:false
	,defaultValue:''
 * }</code></pre>
 */
//@override
FDRadio.prototype.getOptions = function() {
	var options = FDRadio.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 垂直排放
		vertical:false
		,defaultValue:''
	});
}

/**
 * @private
 */
//@override
FDRadio.prototype.getItemTemplate = function() {
	var jStr = new JString();
	var layoutClassName = this.options.vertical ? 'vertical' : 'horizontal' ;
	
	jStr.append('<div class="'+layoutClassName+'"><input type="radio" id="{id}" name="{name}" value="{value}"/>')
		.append('<label for="{id}">{text}</label></div>');
		
	return jStr.toString();
}

/**
 * 重写父类方法
 * @param val,单值
 */
//@override
FDRadio.prototype.setValue = function(val) {
	var controls = this.getControlItems();
	
	FDLib.util.each(controls,function(ctrl){
		ctrl.checked = '';
		if(ctrl.value == val) {
			ctrl.checked = "checked";
			return false;
		}
	});
}

/**
 * 重写父类方法
 * @return 返回单值
 */
//@override
FDRadio.prototype.getValue = function() {
	var controls = this.getControlItems();
	return FDLib.util.each(controls,function(ctrl){
		if(ctrl.checked) {
			return ctrl.value;
		}
	});
}

