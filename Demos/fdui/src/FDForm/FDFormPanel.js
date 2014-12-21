/**
 * 管理form控件的容器
 * @private
 */
var FDFormPanel = function(options) {
	this.options = this.options = FDLib.util.apply(this.getOptions(),options);
	this.controls = this.options.controls;
}

FDFormPanel.prototype = {
	getOptions:function() {
		return {
			controls:[]
			,url:''
			,grid:null
			,win:null
			,crudUrl:null
		};
	}
	,submit:function(callback) {
		var data = this.getValues();
		var url = this.getUrl();
		FDLib.ajax.request({url:url,params:data,success:function(){
			if(FDLib.util.isFunction(callback)) {
				callback();
			}
		}});
	}
	/**
	 * 添加
	 */
	,add:function() {
		this.setUrl(this.getCrudUrl().add);
		this.reset();
		this.getWin().show();
	}
	/**
	 * 修改
	 * @param rowIndex 表格行索引
	 */
	,update:function(data) {
		this.setUrl(this.getCrudUrl().update);
		this.setValues(data);
		this.getWin().show();
	}
	/**
	 * 删除
	 * @param rowIndex 表格行索引
	 */
	,del:function(data) {
		var self = this;
		FDWindow.confirm('确定删除这条记录?',function(){
	    	self.setUrl(self.getCrudUrl().del);
			self.setValues(data);
			self.submit(function(){
				self.getWin().close();
				self.getGrid().reload();
			});
		});
	}
	,save:function() {
		var result = this.validate();
		if(!result) {
			return false;
		}
		var self = this;
		this.submit(function(){
			self.getGrid().reload();
			self.getWin().close();
		});
	}
	/**
	 * 验证panel中所有的控件
	 * @return 如果有一个控件为false,则返回false;全部为true时返回true
	 */
	,validate:function() {
		for(var i=0,len=this.controls.length; i<len; i++) {
			if(!this.controls[i].validate()) {
				return false;
			}
		}
		return true;
	}
	/**
	 * 设置提交的url
	 * @param url url
	 */
	,setUrl:function(url) {
		this.options.url = url;
	}
	/**
	 * 返回提交的url
	 * @return 提交的url
	 */
	,getUrl:function() {
		return this.options.url;
	}
	/**
	 * 获取增删改查的url
	 * @return 返回一个json对象,如:
	 * {
		add:ctx + '/addStudent.do'
		,update:ctx + '/updateStudent.do'
		,del:ctx + '/delStudent.do'
		}
	 */
	,getCrudUrl:function() {
		return this.options.crudUrl;
	}
	,getWin:function() {
		return this.options.win;
	}
	,getGrid:function() {
		return this.options.grid;
	}
	/**
	 * 通过name获取控件
	 * @param name 控件的name属性
	 * @return 返回控件对象
	 */
	,getControl:function(name) {
		return FDLib.util.each(this.controls,function(control){
			if(control.getName() == name) {
				return control;
			}
		});
	}
	/**
	 * 批量设置数据
	 * @param values json数据
	 */
	,setValues:function(values) {
		var util = FDLib.util;
		if(util.isObject(values)) {
			util.each(this.controls,function(control){
				var value = values[control.getName()];
				control.setValue(value);
			});
		}
	}
	/**
	 * 获取所有控件的数据
	 * 
	 * @param key,如果该参数存在,则返回指定的json数据
	 * 
	 * @return 返回json数据
	 */
	,getValues:function(key) {
		var data = {};
		
		FDLib.util.each(this.controls,function(control){
			data[control.getName()] = control.getValue();
		});
		
		if(key) {
			return data[key];
		}
		return data;
	}
	/**
	 * 重置panel中的所有控件
	 */
	,reset:function() {
		FDLib.util.each(this.controls,function(control){
			control.reset();
		});
	}
}