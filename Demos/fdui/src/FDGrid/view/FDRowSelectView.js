/**
 * 行选择
 * 2012-9-10
 * @private
 */
var FDRowSelectView = function(selectOption,options) {
	this.selectOption = selectOption;
	this.options = options;
	selectOption.name = selectOption.name || 'grid_select_' + FDControl.generateCount();
}

FDLib.extend(FDRowSelectView,FDCellView);

// @override
FDRowSelectView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var selector = this._buildSelector(rowData,rowIndex,tr);
	td.appendChild(selector);
	td.className = "selectbox";
}

FDRowSelectView.prototype._buildSelector = function(rowData,rowIndex,tr) {
	var self = this;
	var selectType = this.selectOption.isSingleSelect ? "radio" : "checkbox";
	
	var selector = document.createElement(FDTag.INPUT);
	selector.setAttribute('type',selectType);
	selector.setAttribute('name',this.selectOption.name);
	
	var onclickHandler = this.selectOption.onclick;
	
	var selectedHandler = this.options.selectedHanlder;
	var noSelectedHanlder = this.options.noSelectedHanlder;
		// 设置事件
	selector.onclick = function() {
		if(FDLib.util.isFunction(onclickHandler)) {
			onclickHandler(rowData,rowIndex,tr,this);
		}
		if(selectType === 'radio') {
			self._clearAllSelected();
		}
		if(this.checked) {
			selectedHandler(this,rowIndex);
		}else{
			noSelectedHanlder(this,rowIndex);
		}
	}
	
	return selector;
}


FDRowSelectView.prototype._clearAllSelected = function() {
	var rows = this.options.gridDomMap.tbody_0.rows;
	var domUtil = FDLib.dom;
	var className = this.options.selectedClassName;
	FDLib.util.each(rows,function(row){
		if(domUtil.hasClass(row,className)) {
			domUtil.removeClass(row,className);
			return false;
		}
	});
}
