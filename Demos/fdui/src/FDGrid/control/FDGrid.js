/**
 * Grid控件
 * @example 示例:
grid = new FDGrid({
	domId:'grid'
	//,url:'data.json'
	//,width:'200px'
	,height:'200px'
	,data:gridData
	,rowRender:function(rowData,tr,rowIndex){
		// 如果是第三行,则改变背景颜色
		// 年龄加10
		if(rowIndex + 1 == 3) {
			tr.style.backgroundColor = "#CCC";
			rowData.age = rowData.age + 10;
		}
	}
	,columns:[
		{text:"姓名",name:"username",style:'width:100px;'}
		,{text:"联系地址",name:"addr",style:'width:100px;'}
		,{text:"出生日期",name:"birthday",style:'width:100px;'}
		,{text:"年龄(靠右对齐)",name:"age",render:function(rowData,td,rowIndex){
			// 如果年龄>= 70,则背景色变红
			if(rowData.age >= 70) {
				td.style.backgroundColor = "red";
			}
			if(rowData.age <= 20) {
				td.style.color = "green";
			}
			td.align = 'right';
			return rowData.age;
		},style:'width:100px;'}
	]
	,actionButtons:[
		{text:'修改',onclick:update}
		,{text:'删除',onclick:del,showFun:function(rowData,rowIndex){
			// 如果是3的倍数就显示删除按钮
			return ((rowIndex+1) % 3 === 0)
		}}
	]
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDGrid = function(options) {
	/**
	 * 存放view实例
	 */
	this.viewInstance;
	/**
	 * 存放model实例
	 */
	this.modelInstance;
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	this.registView();
	this.registModel();
	
	this.search();
}

FDGrid.prototype = {
	/**
	 * 返回默认属性
	 * @return 返回json数据类型<pre><code>
{
	// 节点ID,即把表格画在哪个节点上
	domId:''
	// 服务端请求链接
	,url:''
	,width:''
	,height:''
	 // 申明表格列,width默认为100
	 // { text:"姓名",name:"username",width:100,style:'text-align:center;',render:function(rowData,td,rowIndex){return "aaa";} }
	,columns:[]
	 // 表格操作按钮,showFun返回布尔类型数据,true显示操作按钮
	 // {text:'修改',onclick:'update',showFun:function(rowData,rowIndex){}}
	,actionButtons:[]
	 // 列选择设置,
	 //	isSelectable是否多选
	 // isSingleSelect是否单选
	,selectOption:{isMultiSelect:false,isSingleSelect:false,onclick:null}
	 // 存放表格DOM节点实例,统一管理
	,gridDomMap:{
		tbody_0:null
		,table_1:null
		,tableDiv_2:null
		,gridDiv_3:null
		,contDiv_4:null
		
		,headThead_0:null
		,headTable_1:null
		,headDiv_2:null
		
		,pageDiv_3:null
		,paginTable_2:null
		,paginTfoot_1:null
	}
	 // 操作列的列名
	,actionColumnText:'操作'
	 // 当前行render事件
	 // @param domTr当前行DOM对象
	 // @param rowData当前数据
	 // @param rowIndex当前行索引
	,rowRender:function(domTr,rowData,rowIndex){}
	 // 装饰器
	,decorators:GlobalParams.decorators
	 // 视图层类
	,view:GlobalParams.defalutView
	 // 模型层类
	,model:GlobalParams.defalutModel
	// 是否显示分页组件
	,isShowPagination:true
	 // 当前页数
	,pageCount:0
	 // 每页几条数据
	,pageSize:10
	 // 当前页索引
	,pageIndex:1
	 // 总共几条数据
	,total:0
	 // 页大小选择
	,pageSizeParam:[10,20,30]
	,pageParam:{}
	 // 结果
	,result:null
	,data:null
	};
}
</code></pre>
	 */
	getOptions:function() {
		var self = this;
		// --------- 默认属性 ---------
		return {
			/**
			 * 节点ID,即把表格画在哪个节点上
			 */
			domId:''
			/**
			 * 服务端请求链接
			 */
			,url:''
			,width:''
			,height:''
			/**
			 * 申明表格列,width默认为100
			 * { text:"姓名",name:"username",width:100,style:'text-align:center;'
			 * 	,render:function(rowData,td,rowIndex){return "aaa";}
			 *  ,sortName:'' }
			 */
			,columns:[]
			/**
			 * 操作列配置表
			 */
			,actionColumnConfig:{text:'操作',width:100,style:{'textAlign':'center'}}
			/**
			 * 表格操作按钮
			 * {text:'修改',onclick:'update',showFun:function(rowData,rowIndex){}}
			 */
			,actionButtons:[]
			/**
			 * 列选择设置,
			 * 	isSelectable是否多选
			 * 	isSingleSelect是否单选
			 */
			,selectOption:{isMultiSelect:false,isSingleSelect:false,onclick:null}
			/**
			 * 存放表格DOM节点实例,统一管理
			 */
			,gridDomMap:{
				tbody_0:null
				,table_1:null
				,tableDiv_2:null
				,gridDiv_3:null
				,contDiv_4:null
				
				,headThead_0:null
				,headTable_1:null
				,headDiv_2:null
				
				,pageDiv_3:null
				,paginTable_2:null
				,paginTfoot_1:null
			}
			/**
			 * 当前行render事件
			 * @param domTr当前行DOM对象
			 * @param rowData当前数据
			 * @param rowIndex当前行索引
			 */
			,rowRender:function(domTr,rowData,rowIndex){}
			/**
			 * 装饰器
			 */
			,decorators:GlobalParams.decorators
			/**
			 * 视图层类
			 */
			,view:GlobalParams.defalutView
			/**
			 * 模型层类
			 */
			,model:GlobalParams.defalutModel
			/**
			 * 是否显示分页组件
			 */
			,isShowPagination:true
			/**
			 * 当前页数
			 */
			,pageCount:0
			/**
			 * 每页几条数据
			 */
			,pageSize:10
			
			/**
			 * 当前页索引
			 */
			,pageIndex:1
			,total:0
			,pageSizeParam:[10,20,30]
			,schData:{}
			/**
			 * 结果
			 */
			,result:null
			,data:null
			,sortName:null
			,sortOrder:'DESC'
			,selectedHanlder:function(selector,i) {
				var rows = self.options.getTableTR();
				if(selector.disabled) {
					return;
				}
				selector.checked = 'checked';
				FDLib.dom.addClass(rows[i],self.options.selectedClassName);
			}
			,noSelectedHanlder:function(selector,i) {
				var rows = self.options.getTableTR();
				if(selector.disabled) {
					return;
				}
				selector.checked = '';
				FDLib.dom.removeClass(rows[i],self.options.selectedClassName);
			}
			,getTableTR:function() {
				return self.options.gridDomMap.tbody_0.rows;
			}
			,selectedClassName : 'row-selected'
		};
	}
	
	// --------- 默认方法 ---------
	/**
	 * 注册view
	 * @private
	 */
	,registView:function() {
		var view = this.options.view;
		// 默认的view,被装饰对象
		var viewInstance = new view(this.options);
		viewInstance = this._initDecorators(viewInstance);
		this.viewInstance = viewInstance;
	}
	/**
	 * 初始化装饰器,如果没有装饰器就返回默认的view实例
	 * @private
	 */
	,_initDecorators:function(viewInstance) {
		var decorators = this.options.decorators;
		var self = this;
		
		FDLib.util.each(decorators,function(deforators){
			viewInstance = new deforators(viewInstance,self);
		});
		
		return viewInstance;
	}
	/**
	 * @private
	 */
	,registModel:function() {
		var model = this.options.model;
		this.modelInstance = new model();
	}
	/**
	 * 搜索
	 * @param data 查询参数,json格式
	 */
	,search:function(schData) {
		if(this.options.data) {
			this.options.result = this.options.data;
			this.callViewsProcess();
		}else if(this.options.url){
			this.options.schData = schData || {};
			this.pageIndex = 1;
			this.postData();
		}
	}
	/**
	 * @private
	 */
	,buildParam:function() {
		var param = this.options.schData || {};
		param[GlobalParams.pageIndex] = this.options.pageIndex;
		param[GlobalParams.pageSize] = this.options.pageSize;
		// 排序字段
		if(this.options.sortName) {
			param[GlobalParams.sortName] = this.options.sortName;
			param[GlobalParams.sortOrder] = this.options.sortOrder;
		}
		
		return param;
	}
	/**
	 * 排序,只支持单属性排序
	 * @param sortName 排序字段名
	 * @param sortOrder 排序方式,即ASC,DESC
	 */
	,sort:function(sortName,sortOrder) {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		
		this.refresh();
	}
	/**
	 * 获取当前排序方式
	 */
	,getSortOrder:function() {
		return this.options.sortOrder;
	}
	/**
	 * 获取当前排序字段
	 */
	,getSortName:function() {
		return this.options.sortName;
	}
	/**
	 * @private
	 */
	,postData:function() {
		var self = this;
		var param = this.buildParam();
		this.modelInstance.postData(this.options.url,param,function(e){
			self.options.result = JSON.parse(e);
			self._initParam();
			self.callViewsProcess();
		});
	}
	,_initParam:function() {
		var result = this.options.result;
		this.options.pageIndex = result[GlobalParams.pageIndex] || 1;
		this.options.total = result[GlobalParams.total] || 0;
		this.options.rows = result[GlobalParams.rows] || [];
		this.options.pageCount = parseInt((this.options.total - 1)/this.options.pageSize) + 1 || 10;
	}
	/**
	 * 调用视图层处理后台数据
	 * @private
	 */
	,callViewsProcess:function() {
		this.viewInstance.processData(this.options.result);
	}
	/**
	 * 本地刷新表格
	 */
	,refresh:function() {
		this.postData();
	}
	/**
	 * 重新加载数据
	 */
	,reload:function() {
		this.resetParams();
		this.search();
	}
	/**
	 * 重置搜索参数
	 */
	,resetParams:function() {
		this.options.pageIndex = 1;
		this.options.schData = {};
	}
	/**
	 * @private
	 */
	,resetParam:function() {
		this.options.pageIndex = 1;
	}
	/**
	 * 删除某一行
	 * @param rowIndex 行索引
	 */
	,deleteRow:function(rowIndex) {
		if(this.options.rows.length > i){
		 	this.options.rows.splice(i,1);
		 	this.callViewsProcess();
		}
	}
	/**
	 * 是否是选择状态
	 */
	,isSelectStatus:function() {
		var selectOption = this.options.selectOption;
		return this.isSingleSelect() || this.isMultiSelect();
	}
	/**
	 * 是否单选
	 */
	,isSingleSelect:function() {
		var selectOption = this.options.selectOption;
		return selectOption.isSingleSelect;
	}
	/**
	 * 是否多选
	 */
	,isMultiSelect:function() {
		var selectOption = this.options.selectOption;
		return selectOption.isMultiSelect;
	}
	,_getSelectAllInput:function() {
		if(this.isMultiSelect()) {
			var table = this._getHeadTable();
			var rowIndex = 0;
			return this._getInput(table,rowIndex);
		}
	}
	/**
	 * 通过行索引获取选择器,即input
	 */
	,getSelectorByRowIndex:function(rowIndex) {
		if(this.isSelectStatus()) {
			var table = this._getTable();
			return this._getInput(table,rowIndex);
		}
	}
	,_getInput:function(table,rowIndex) {
		var row = table.rows[rowIndex];
		var cell = row.cells[0];
		return cell.getElementsByTagName('input')[0];
	}
	// 能否操作选择器
	// 选择器存在并且没有禁用
	,_couldOperateSelector:function(selector) {
		return selector && !selector.disabled
	}
	,_getTable:function() {
		return this.options.gridDomMap.table_1;
	}
	,_getHeadTable:function() {
		return this.options.gridDomMap.headTable_1;
	}
	/**
	 * 设置某行数据被选中 
	 * @param rowIndex 行索引
	 */
	,setSelected:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		this.options.selectedHanlder(selector,rowIndex);
	}
	/**
	 * 设置某行数据不被选中 
	 * @param rowIndex 行索引
	 */
	,setNoSelected:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		this.options.noSelectedHanlder(selector,rowIndex);
	}
	/**
	 * 全不选
	 * 仅在多选情况下
	 */
	,clearSelected:function() {
		if(this.isMultiSelect()) {
			var table = this._getTable();
			var rowsCount = table.rows.length;
			for(var i=0; i<rowsCount; i++) {
				this.setNoSelected(i);
			}
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "";
			}
		}
	}
	/**
	 * 全选
	 */
	,selectAll:function() {
		if(this.isMultiSelect()) {
			var table = this._getTable();
			var rowsCount = table.rows.length;
			for(var i=0; i<rowsCount; i++) {
				this.setSelected(i);
			}
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "checked";
			}
		}
	}
	/**
	 * 得到被单选数据
	 * @return json格式
	 */
	,getSelectedLine:function() {
		if(this.isSingleSelect()) {
			var rows = this.getAllData();
			var self = this;
			return FDLib.util.each(rows,function(row,i){
				var selector = self.getSelectorByRowIndex(i);
				if(selector && selector.checked) {
					return row;
				}
			});
		}
	}
	/**
	 * 得到被多选数据
	 * @return 数组格式
	 */
	,getSelectedRows:function() {
		if(this.isMultiSelect()) {
			var ret = [];
			var rows = this.getAllData();
			var self = this;
			FDLib.util.each(rows,function(row,i){
				var selector = self.getSelectorByRowIndex(i);
				if(selector && selector.checked) {
					ret.push(row)
				}
			});
			
			return ret;
		}
	}
	/**
	 * 得到某行数据
	 * @param rowIndex 行索引
	 * @return json格式
	 */
	,getData:function(rowIndex) {
		return this.getAllData()[rowIndex];
	}
	/**
	 * 获取所有数据
	 * @return 数组格式
	 */
	,getAllData:function() {
		return this.options.result.rows || [];
	}
	/**
	 * 得到当前数据条数
	 * @return 返回int类型
	 */
	,getDataLength:function() {
		return this.getAllData().length;
	}
	/**
	 * 设置某行不可选(在有选择框的条件下)
	 * @param rowIndex 行索引
	 */
	,setRowDisabled:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector) {
			selector.disabled = 'disabled';
		}
	}
	/**
	 * 设置某行可选(在有选择框的条件下)
	 * @param rowIndex 行索引
	 */
	,setRowEnabled:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector) {
			selector.disabled = '';
		}
	}
	/**
	 * 跳转至首页
	 */
	,moveFirst:function() {
		if(this.options.pageIndex != 1) {
			this.options.pageIndex = 1;
			this.refresh();
		}
	}
	/**
	 * 上一页
	 */
	,movePreview:function() {
		if(this.options.pageIndex > 1) {
			this.options.pageIndex--;
			this.refresh();
		}
	}
	/**
	 * 下一页
	 */
	,moveNext:function() {
		if(this.options.pageIndex < this.options.pageCount) {
			this.options.pageIndex++;
			this.refresh();
		}
	}
	/**
	 * 跳转至尾页
	 */
	,moveLast:function() {
		if(this.options.pageIndex != this.options.pageCount) {
			this.options.pageIndex = this.options.pageCount;
			this.refresh();
		}
	}
	
};

