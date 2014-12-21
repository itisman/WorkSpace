/*
 * 画出表格内容的视图层
 * @private
 */
var FDTableView = function(options) {
	FDLib.implement(this,View);
	
	this.each = FDLib.util.each;
	this.options = options;
	// 后台返回的数据
	this.resultData = null;
	// 存放FDCellView的实例
	this.cellViews = this._buildCellView();
	
	this.gridDomMap = this.options.gridDomMap;
	
	this._initTableDom();
	
	this.renderTo(this.options.domId);
}

FDTableView.prototype.getTableView = function() {
	return this;
}

/**
 * 处理数据
 * @param data 格式类型:
 * {total:10,pageIndex:1,pageSize:10,gridMsg:'你好'
 * 	,rows:[{name:'jim',age:22},{name:'Tom',age:33}]
 * }
 */
FDTableView.prototype.processData = function(resultData) {
	this.resultData = resultData;
	
	this.removeAllData();
	this._buildGridData();
}

FDTableView.prototype.renderTo = function(domId) {
	var desDom = FDLib.getEl(domId) || document.body;
	desDom.appendChild(this.gridDomMap.contDiv_4);
}

/**
 * 移除所有数据
 */
FDTableView.prototype.removeAllData = function() {
	this.gridDomMap.tbody_0.parentNode.removeChild(this.gridDomMap.tbody_0);
	this.gridDomMap.tbody_0 = document.createElement(FDTag.TBODY);
	this.gridDomMap.table_1.appendChild(this.gridDomMap.tbody_0);
}

/**
 * 设置样式
 */
FDTableView.prototype.setStyle = function() {
	this.gridDomMap.contDiv_4.className = "fdtable";
	this.gridDomMap.table_1.className = "fdtable-stylized fdtable-full";
}

FDTableView.prototype._setTrStyle = function(tr,rowIndex) {
	if(rowIndex % 2 === 0) {
		tr.className = "alt-row"
	}
}

/**
 * 构建表格内容
 */
FDTableView.prototype._buildGridData = function() {
	this.hideTable();
	var rows = this.resultData[GlobalParams.rows] || [];
	var columns = this.options.columns;
	var self = this;
	// 遍历后台返回的rows
	this.each(rows,function(rowData,rowIndex){
		self.insertRow(rowIndex,rowData);
	});
	this.showTable();
}

/**
 * 插入行数据
 * @param rowIndex 行索引
 * @param cells 数组,存放这一行所有单元格的数据
 * [
 * 	{html:'单元格内容1',text:'列名1',name:'username1',style:'width:100px;'}
 * 	,{html:'单元格内容2',text:'列名2',name:'username2',style:'width:200px;'}
 * 	,{html:'单元格内容3',text:'列名3',name:'username3',style:'width:300px;'}
 * ]
 * @param rowData 行的json数据
 */
FDTableView.prototype.insertRow = function(rowIndex,rowData) {
	// 创建行
	var tr = this.gridDomMap.tbody_0.insertRow(rowIndex);
	this._setTrStyle(tr,rowIndex);
	// 执行行的render方法
	this.options.rowRender(rowData,tr,rowIndex);
	
	this._buildRowCellsHtml(rowData,tr,rowIndex);
}

FDTableView.prototype._buildRowCellsHtml = function(rowData,tr,rowIndex) {
	this.each(this.cellViews,function(cellView,columnIndex){
		var td = tr.insertCell(columnIndex); // 创建TD
		// 单元格数据
		cellView.buildCellData(rowData,td,rowIndex,tr);
	});
}

FDTableView.prototype.showTable = function() {
	this.gridDomMap.table_1.style.display = "";
}

FDTableView.prototype.hideTable = function() {
	this.gridDomMap.table_1.style.display = "none";
}


/**
 * 初始化构单元格视图层的实例
 */
FDTableView.prototype._buildCellView = function() {
	var columns = this.options.columns;
	var cellViews = [];
	
	cellViews = this._addRowSelectAbility(cellViews);
	
	this.each(columns,function(column){
		cellViews.push(new FDCellView(column));
	})
	
	cellViews = this._addActionButtonAbility(cellViews);
	
	return cellViews;
}

FDTableView.prototype._addRowSelectAbility = function(cellViews) {
	if(this.isMultiSelect() || this.isSingleSelect()) {
		cellViews.push(new FDRowSelectView(this.options.selectOption,this.options));
	}
	return cellViews;
}



FDTableView.prototype._addActionButtonAbility = function(cellViews) {
	cellViews.push(new FDButtonView(this.options));
	
	return cellViews;
}

FDTableView.prototype.isMultiSelect = function() {
	return this.options.selectOption.isMultiSelect;
}

/**
 * 是否单选
 */
FDTableView.prototype.isSingleSelect = function() {
	return this.options.selectOption.isSingleSelect;
}

/**
 * 初始化表格框架.
 * 数字下标表示嵌套的层,0表示最内层,1在0的外层,以此类推
 */
FDTableView.prototype._initTableDom = function() {
	this.gridDomMap.contDiv_4 = document.createElement(FDTag.DIV);
	this.gridDomMap.gridDiv_3 = document.createElement(FDTag.DIV);
	this.gridDomMap.tableDiv_2 = document.createElement(FDTag.DIV);
	this.gridDomMap.table_1 = document.createElement(FDTag.TABLE);
	this.gridDomMap.tbody_0 = document.createElement(FDTag.TBODY);
	
	this.gridDomMap.table_1.appendChild(this.gridDomMap.tbody_0);
	this.gridDomMap.tableDiv_2.appendChild(this.gridDomMap.table_1);
	this.gridDomMap.gridDiv_3.appendChild(this.gridDomMap.tableDiv_2);
	this.gridDomMap.contDiv_4.appendChild(this.gridDomMap.gridDiv_3);
	
	this._initTableSize();
	this.setStyle();
}

FDTableView.prototype._initTableSize = function() {
	var width = this.options.width;
	var height = this.options.height;
	if(width) {
		this.gridDomMap.tableDiv_2.style.overflow = "auto";
		this.gridDomMap.tableDiv_2.style.width = width;
	}
	if(height) {
		this.gridDomMap.tableDiv_2.style.overflow = "auto";
		this.gridDomMap.tableDiv_2.style.height = height;
	}
}


