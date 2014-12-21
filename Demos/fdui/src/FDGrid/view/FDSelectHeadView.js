/**
 * 构建表格head的select项
 * @param column: 
 * { text:"姓名",width:100,style:'text-align:100px;'
 *  }
 * @private
 */
var FDSelectHeadView = function(selectOption,options) {
	this.selectOption = selectOption;
	this.options = options;
}

FDLib.extend(FDSelectHeadView,FDHeadView)

FDSelectHeadView.prototype.buildCellData = function(td) {
	if(this.selectOption.isMultiSelect) {
		var selector = this._buildSelector(td);
		td.appendChild(selector);
		td.className = "selectbox";
	}
	if(this.selectOption.isSingleSelect) {
		td.className = "noselectbox";
	}
}

FDSelectHeadView.prototype._buildSelector = function(td) {
	var self = this;
	var selector = document.createElement(FDTag.INPUT);
	selector.setAttribute('type','checkbox');
	
	var selectedHandler = this.options.selectedHanlder;
	var noSelectedHanlder = this.options.noSelectedHanlder;
	
	// 全选的checkbox
	selector.onclick = function() {
		var selectors = document.getElementsByName(self.selectOption.name);
		var checked = this.checked ? 'checked' : ''
		
		FDLib.util.each(selectors,function(selector,i){
			if(selector.disabled) {
				return;
			}
			if(checked) {
				selectedHandler(selector,i);
			}else{
				noSelectedHanlder(selector,i);
			}
		});
	}
	
	return selector;
}

