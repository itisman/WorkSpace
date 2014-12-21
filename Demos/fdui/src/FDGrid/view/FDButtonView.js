/**
 * 构建列按钮
 * @param options 
 * {
 * 	text:'修改'
 * 	,onclick:function(rowData,rowIndex){}
 * 	,render:function(rowData,td,rowIndex){}
 * 	,showFun:function(data){}
 * }
 * @private
 */
var FDButtonView = function(options) {
	this.options = options;
	this.actionButtons = this.options.actionButtons;
	this.actionColumnConfig = this.options.actionColumnConfig;
}

FDLib.extend(FDButtonView,FDCellView);

// @override
FDButtonView.prototype.buildCellData = function(rowData,td,rowIndex) {
	var self = this;
	var width = FDLib.util.formatSize(this.actionColumnConfig.width || '') || 100
		,style = this.actionColumnConfig.style;
	
	style.width = width + 'px';
	FDLib.util.each(this.actionButtons,function(button){
		var a = self._buildButton(button,rowData,rowIndex);
		
		if(a) {
			td.appendChild(a);
			FDLib.dom.bindDomStyle(td,style);
		}
	});

}

/**
 * 构建一个a标签,如果不显示则返回undefined
 */
FDButtonView.prototype._buildButton = function(button,rowData,rowIndex) {
	if(this._isShowButton(button,rowData,rowIndex)) {
		var a = document.createElement(FDTag.A);
		a.href = 'javascript:void(0)';
		a.innerHTML = button.text;
		a.onclick = function() {
			button.onclick(rowData,rowIndex);
		}
		return a;
	}
}

/**
 * 是否显示按钮
 */
FDButtonView.prototype._isShowButton = function(button,rowData,rowIndex) {
	var hasShowFunHandler = FDLib.util.isFunction(button.showFun);
	if(hasShowFunHandler) {
		return button.showFun(rowData,rowIndex);
	}
	return true;
}


