/**
 * GDGrid全局参数
 * @class
 */
var GlobalParams = {
	/**
	 * 服务器端返回json数据的页索引标识
	 * @field
	 */
	pageIndex:"pageIndex"
	/**
	 * 服务器端返回json数据的页大小标识
	 * @field
	 */
	,pageSize:"pageSize"
	/**
	 * 服务器端返回json数据的总记录数标识
	 * @field
	 */
	,total:"total"
	/**
	 * 服务器端返回json数据的rows标识
	 * @field
	 */
	,rows:"rows"
	/**
	 * 服务器端接收的排序字段名
	 * @field
	 */
	,sortName:'sortname'
	/**
	 * 服务器端接收的排序方式字段名
	 * @field
	 */
	,sortOrder:'sortorder'
	/**
	 * 装饰器
	 * @private
	 */
	,decorators:[FDTableDecorator,FDHeadDecorator,FDPaginationDecorator]
	/**
	 * 默认视图层
	 * @private
	 */
	,defalutView:FDTableView
	/**
	 * 默认模型层
	 * @private
	 */
	,defalutModel:FDModel
}