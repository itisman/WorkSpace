/**
 * 表格列名的装饰类
 * @private
 */
var FDHeadDecorator = function(view,grid) {
	FDHeadDecorator.superclass.constructor.call(this,view);
	this.grid = grid;
	this.tableView = this.getTableView();
	this.options = this.getOptions();
	this.gridDomMap = this.options.gridDomMap;
	
	this.headCellViews;
}

FDLib.extend(FDHeadDecorator,FDTableDecorator);

FDHeadDecorator.prototype.processData = function(data) {
	if(!this.gridDomMap.headDiv_2) {
		this.buildHead();
		this.setStyle();
	}
	FDHeadDecorator.superclass.processData.call(this,data);
}

/**
 * 设置样式
 */
FDHeadDecorator.prototype.setStyle = function() {
	this.gridDomMap.headTable_1.className = "fdtable-stylized fdtable-full";
}

/**
 * 构建表头
 */
FDHeadDecorator.prototype.buildHead = function() {
	this.gridDomMap.headDiv_2 = document.createElement(FDTag.DIV);
	this.gridDomMap.headTable_1 = document.createElement(FDTag.TABLE);
	this.gridDomMap.headThead_0 = this.gridDomMap.headTable_1.createTHead();
	var tr = this.gridDomMap.headThead_0.insertRow(0);
	this.gridDomMap.headDiv_2.appendChild(this.gridDomMap.headTable_1);
	
	this._buildHeadHtml(tr);
	
	this._insertBeforeTable();
}

/**
 * 构建head内容
 */
FDHeadDecorator.prototype._buildHeadHtml = function(tr) {
	this._initHeadCellViews();
	var cellViews = this.headCellViews;
	FDLib.util.each(cellViews,function(cellView,columnIndex){
		var td = tr.insertCell(columnIndex); // 创建TD
		// 单元格数据
		cellView.buildCellData(td);
	});
}

/**
 * 插在表格前面
 */
FDHeadDecorator.prototype._insertBeforeTable = function() {
	var gridDiv_3 = this.gridDomMap.gridDiv_3;
	var tableDiv_2 = this.gridDomMap.tableDiv_2;
	gridDiv_3.insertBefore(this.gridDomMap.headDiv_2,tableDiv_2);
}

FDHeadDecorator.prototype._initHeadCellViews = function() {
	this.headCellViews = [];
	var options = this.options;
	var columns = options.columns;
	var self = this;
	// 如果有选择列
	this._addSelectView();
	
	FDLib.util.each(columns,function(column){
		self.headCellViews.push(new FDHeadView(column,self.grid));
	});
	// 如果有操作列
	this._addButtonView(options);
}

FDHeadDecorator.prototype._addSelectView = function() {
	var selectOption = this.options.selectOption;
	if(selectOption.isMultiSelect || selectOption.isSingleSelect) {
		this.headCellViews.push(new FDSelectHeadView(selectOption,this.options));
	}
}

FDHeadDecorator.prototype._addButtonView = function(options) {
	if(options.actionButtons.length > 0) {
		this.headCellViews.push(new FDHeadView(this.options.actionColumnConfig));
	}
}

