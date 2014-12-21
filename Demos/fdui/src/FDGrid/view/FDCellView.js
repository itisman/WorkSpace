/**
 * 构建单元格的类
 * 
 * @param options 列的结构
 * { text:"姓名",name:"username",width:100,style:'text-align:100px;'
 * 	,render:function(data){return "aaa";} }
 * @private
 */
var FDCellView = function(options) {
	this.options = options;
}

/**
 * 构建表格单元格信息
 * @param rowIndex 当前行索引,从0开始
 * @param rowData 当前行的数据
 * @return 返回单元格信息. 数据格式为:
 * {html:'单元格内容',text:'列名',name:'username',width:100,style:'width:100px;'}
 */
FDCellView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var html
		,width = FDLib.util.formatSize(this.options.width || '') || 100
		,style = this.options.style || {};
		
	if(FDLib.util.isFunction(this.options.render)){
		html = this.options.render(rowData,td,rowIndex);
	}else{
		html = rowData[this.options.name];
	}
	
	td.innerHTML = html; // 设置TD内容
	
	style.width = width + 'px';
	FDLib.dom.bindDomStyle(td,style);
}

