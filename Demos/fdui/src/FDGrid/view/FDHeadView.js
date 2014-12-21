/**
 * 构建表格head的view
 * @param column: 
 * { text:"姓名",width:100,style:'text-align:100px;'
 *  }
 * @private
 */
var FDHeadView = function(column,grid) {
	this.column = column;
	this.grid = grid;
	this.upTxt = "▲";
	this.downTxt = "▼";
}

FDHeadView.prototype.buildCellData = function(td) {
	var width = FDLib.util.formatSize(this.column.width || '') || 100
		,style = this.column.style || {};
	
	style.width = width + 'px';
	td.innerHTML = this.column.text; // 设置TD内容
	this._buildSortButton(td);
	FDLib.dom.bindDomStyle(td,style);
}

// 构建排序按钮
FDHeadView.prototype._buildSortButton = function(td) {
	if(this.column.sortName) {
		// 设置当前排序方式
		this.currentSortOrder = this.grid.getSortOrder() || "DESC";
		
		var sortClickBtn = this._buildTagA();
		
		this._initTagAEvent(sortClickBtn);
				
		td.appendChild(sortClickBtn);
	}
}

FDHeadView.prototype._buildTagA = function() {
	var sortClickBtn = document.createElement(FDTag.A);
	sortClickBtn.href = "javascript:void(0)";
	sortClickBtn.innerHTML 
		= (this.currentSortOrder == "DESC")	? this.downTxt : this.upTxt;
		
	return sortClickBtn;
}

FDHeadView.prototype._initTagAEvent = function(a) {
	var self = this;
	var sortName = this.column.sortName;
	FDLib.event.addEvent(a,"click",function(){
		var event = FDLib.event.getEvent();
		var btn = event.target;
		if(self.currentSortOrder == 'ASC') {
			btn.innerHTML = self.downTxt;
			self.currentSortOrder = "DESC";
		}else{
			btn.innerHTML = self.upTxt;
			self.currentSortOrder = "ASC";
		}		
		self.grid.sort(sortName,self.currentSortOrder);
	});
}

