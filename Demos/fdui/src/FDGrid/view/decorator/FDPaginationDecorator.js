/**
 * 分页装饰器
 * @private
 */
var FDPaginationDecorator = function(view,grid) {
	FDPaginationDecorator.superclass.constructor.call(this,view,grid);
	this.grid = grid;
	
	this.options = this.getOptions();
	this.tableView = this.getTableView();
	this.gridDomMap = this.options.gridDomMap;
	
	this.paginInfoDiv;
}

FDLib.extend(FDPaginationDecorator,FDHeadDecorator);

/**
 * 处理数据
 */
// @override
FDPaginationDecorator.prototype.processData = function(data) {
	// 不显示分页
	if(!this.options.isShowPagination) {
		this.options.pageSize = 0;
		return;
	}
	
	FDHeadDecorator.superclass.processData.call(this,data);
	
	if(!this.gridDomMap.pageDiv_3) {
		this._initPaginDom();
		this.buildPagination(data);
	}
	this._refeshResultInfo();
}

FDPaginationDecorator.prototype.buildPagination = function(data) {
	this._buidlPaginButtons();
	
	this._appendPaginToDiv();
}

FDPaginationDecorator.prototype._initPaginDom = function() {
	this.gridDomMap.pageDiv_3 = document.createElement(FDTag.DIV);
	this.gridDomMap.paginTable_2 = document.createElement(FDTag.TABLE);
	this.gridDomMap.paginTfoot_1 = this.gridDomMap.paginTable_2.createTFoot();
	this.paginInfoDiv = document.createElement(FDTag.DIV);
	
	this.setStyle("fdtable-pagination");
}

/**
 * 设置分页样式
 */
FDPaginationDecorator.prototype.setStyle = function(style) {
	this.gridDomMap.pageDiv_3.className = style;
}

FDPaginationDecorator.prototype._appendPaginToDiv = function() {
	this.gridDomMap.paginTable_2.appendChild(this.gridDomMap.paginTfoot_1);
	this.gridDomMap.pageDiv_3.appendChild(this.gridDomMap.paginTable_2);
	this.gridDomMap.contDiv_4.appendChild(this.gridDomMap.pageDiv_3);
}

FDPaginationDecorator.prototype._buidlPaginButtons = function() {
	var firstTR = this.gridDomMap.paginTfoot_1.insertRow(0);
	var cellIndex = 0;
	
	this._buildPageSizeSelector(firstTR,cellIndex++);
	this._buildFirstPageButton(firstTR,cellIndex++);
	this._buildPrePageButton(firstTR,cellIndex++);
	this._buildNextPageButton(firstTR,cellIndex++);
	this._buildLastPageButton(firstTR,cellIndex++);
	this._buildResultInfo(firstTR,cellIndex++);
}

FDPaginationDecorator.prototype._buildPageSizeSelector = function(firstTR,cellIndex) {
	var td = firstTR.insertCell(cellIndex);
	var self = this;
		
	var pageSizeSelect = new FDSelectBox({items:this._getPageSizeItems(),isShowDefaultItem:false});
	
	pageSizeSelect.addEvent('change',function(){
		self.options.pageSize = this.value;
		self.options.pageIndex = 1;
		self.grid.refresh();
	});
	
	pageSizeSelect.renderToDom(td);
	
}

FDPaginationDecorator.prototype._getPageSizeItems = function() {
	var pageSizeParam = this.options.pageSizeParam;
	var selectItems = [];
	
	FDLib.util.each(pageSizeParam,function(pageSize){
		selectItems.push({value:pageSize,text:'每页' + pageSize + '条'});
	});
	
	return selectItems;
}

FDPaginationDecorator.prototype._buildFirstPageButton = function(firstTR,cellIndex) {
	var self = this;
	this._buildButton(firstTR,cellIndex
		,{text:"&lt;&lt;",title:"首页",onclick:function(){
			self.grid.moveFirst();
		}});
}

FDPaginationDecorator.prototype._buildPrePageButton = function(firstTR,cellIndex) {
	var self = this;
	this._buildButton(firstTR,cellIndex
		,{text:"&lt;",title:"上一页",onclick:function(){
			self.grid.movePreview();
		}});;
}

FDPaginationDecorator.prototype._buildNextPageButton = function(firstTR,cellIndex) {
	var self = this;
	this._buildButton(firstTR,cellIndex
		,{text:"&gt;",title:"下一页",onclick:function(){
			self.grid.moveNext();
		}});
}

FDPaginationDecorator.prototype._buildLastPageButton = function(firstTR,cellIndex) {
	var self = this;
	this._buildButton(firstTR,cellIndex
		,{text:"&gt;&gt;",title:"尾页",onclick:function(){
			self.grid.moveLast();
		}});
}

FDPaginationDecorator.prototype._buildResultInfo = function(firstTR,cellIndex) {
	var td = firstTR.insertCell(cellIndex);
	td.appendChild(this.paginInfoDiv);
}

FDPaginationDecorator.prototype._refeshResultInfo = function() {
	var options = this.options;
	var total = options.total;
	var pageIndex = options.pageIndex;
	var pageSize =  options.pageSize;
	var pageCount = options.pageCount;
	this.paginInfoDiv.innerHTML = '|&nbsp;'+pageIndex+'/'+pageCount+'，共'+total+'条数据';
}

FDPaginationDecorator.prototype._buildButton = function(firstTR,cellIndex,param) {
	var td = firstTR.insertCell(cellIndex);
	var a = document.createElement(FDTag.A);
	a.innerHTML = param.text;
	a.title = param.title;
	a.href = "javascript:void(0)";
	a.onclick = param.onclick;
	td.appendChild(a);
}

