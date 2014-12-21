/**
 * 窗体控件FDWindow,继承自<a href="FDPanel.html">FDPanel</a><br>
 * @example 示例:
tip = FDLib.getEl('tip');
win = new FDWindow({
	domId:'win'
	,title:'标题'
	,modal:false
	,afterShow:function(){tip.innerHTML = ('afterShow<br>')}
	,afterClose:function(){tip.innerHTML = ('afterClose<br>')} 
});
win3 = new FDWindow({
	domId:'win3'
	,title:'标题3'
});

var win2 = new FDWindow({domId:'win2',width:'200px',modal:false,dragable:false,title:'无法拖动,无法关闭的标题',closeable:false});
win2.moveTo(100,100);
win2.show();
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-8-8
 */
var FDWindow = function(options) {
	FDWindow.superclass.constructor.call(this,options);
	FDLib.implement(this,FDControl);
}

FDLib.extend(FDWindow,FDPanel);

/**
 * 默认属性,继承<a href="FDPanel.html">FDPanel</a>的属性并添加自身属性
 * @example <pre><code>
{
	domId:''
	// 标题 
	,title:''
	// 按钮,参考FDButton
	,buttons:[]
	// 按钮对齐方式,'left','center','right'
	,buttonAlign:'right'
	// 视图层类 
	,view:FDWindowView
	// 是否显示右上角关闭按钮 
	,closeable:true
	// 显示关闭的文本 
	,closeText:'[关闭]'
	// 能否拖拽窗体 
	,dragable:true
	// 是否显示遮罩层 
	,modal:true
	// 打开窗体后执行的方法 
	,afterShow:null
	// 关闭窗体后执行的方法 
	,afterClose:null
	// 是否立即显示
	,isLoadShow:false
	// 遮罩层颜色
	,modelColor:'#fff'
	// 遮罩层百分比
	,modelOpacity:0.6
}</code></pre>
 */
//@override
FDWindow.prototype.getOptions = function() {
	var options = FDWindow.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		domId:''
		/** 标题 */
		,title:''
		/** 按钮 */
		,buttons:[]
		/** 按钮对齐方式,'left','center','right' */
		,buttonAlign:'right'
		/** 视图层类 */
		,view:FDWindowView
		/** 是否显示右上角关闭按钮 */
		,closeable:true
		/** 显示关闭的文本 */
		,closeText:'[关闭]'
		/** 能否拖拽窗体 */
		,dragable:true
		/** 是否显示遮罩层 */
		,modal:true
		/** 打开窗体后执行的方法 */
		,afterShow:null
		/** 关闭窗体后执行的方法 */
		,afterClose:null
		/** 是否立即显示 */
		,isLoadShow:false
		// 遮罩层颜色
		,modelColor:'#fff'
		// 遮罩层百分比
		,modelOpacity:0.6
	});
}

/**
 * 返回按钮
 * @return 返回按钮集合,数组形式,每个元素都是FDButton对象
 */
FDWindow.prototype.getButtons = function() {
	return this.options.buttons;
}

/**
 * 移动到中央
 */
FDWindow.prototype.moveToCenter = function() {
	this.viewInstance.moveToCenter();
}

/**
 * 移动窗体
 * @param left 距离页面左边的距离,int类型
 * @param top 距离页面顶部的距离,int类型
 */
FDWindow.prototype.moveTo = function(left,top) {
	this.viewInstance.moveTo(left,top);
}

/*------------------------------------confirm------------------------------------*/
/**
 * 确认框,功能类似于window.confirm()
 * @param content 窗口内容
 * @param callback 回调函数,即点击确定后需要执行的函数
 * @param options FDWindow的options参数
 * @example 示例:
<pre>
FDWindow.confirm('确定要删除吗?',function(){
	alert('删除成功')
}); 
</pre>
 */
FDWindow.confirm = (function(){
	
	var confirmWin;
	var def = {
		title:'提示'
		,width:'220px'
		,height:'40px'
		,yesText:"是"
		,noText:"否"
	};
	
	return function(content,callback,options){
		options = FDLib.util.apply(def,options);
		if(!confirmWin) {
			initWin(options);
		}
		setButtonText(options);
		setButtonEvent(callback);
		confirmWin.setContent(content || '');
		confirmWin.show();
	};
	
	function initWin(options) {
		options.domId = buildWindowHtml();
		
		buildButtons(options);
		confirmWin = new FDWindow(options);
	}
	
	function setButtonText(options) {
		var okBtn = confirmWin.getButtons()[0];
		var cancelBtn = confirmWin.getButtons()[1];
		
		okBtn.setText(options.yesText);
		cancelBtn.setText(options.noText);
	}
	
	function setButtonEvent(callback) {
		var okBtn = confirmWin.getButtons()[0];
		okBtn.setOnclick(function(){
			callback();
			confirmWin.close();
		});
	}
	
	function buildButtons(options) {
		var buttons = [
			{text:options.yesText}
			,{text:options.noText,onclick:function(){
				confirmWin.close();
			}}
		]
		
		options.buttons = buttons;
	}
	
	function buildWindowHtml() {
		var div = document.createElement(FDTag.DIV);
		var id = "confirmWin_" + FDControl.generateCount();
		div.setAttribute('id',id);
		document.body.appendChild(div);
		
		return id;
	}
})();
