/**
 * 类FDTableView的装饰器,后面所有的装饰器都要继承这个类
 * @private
 */
var FDTableDecorator = function(view) {
	this.view = view;
}

FDTableDecorator.prototype = {
	processData:function(data) {
		return this.view.processData(data);
	}
	/**
	 * 获取FDTableView实例
	 */
	,getTableView:function() {
		return this.view.getTableView();
	}
	,getOptions:function() {
		return this.getTableView().options;
	}
}
