/**
 * 提供类的接口创建,类的继承操作
 * @example 示例:
 * var Book = createInterface(["getBookName","getPunishDate"]);
 * FDLib.extend(subClass,supClass);
 * @class
 */
var FDLib = (function(){
	var doc = document;
	
	var Interface = function(_methods) {
		if (arguments.length != 1) {
			throw new Error("创建接口参数只能有一个,并且为数组类型");
		}
		this.methods = [];
		this._isInterfaceType = true;

		for (var i = 0, len = _methods.length; i < len; i++) {
			if (typeof _methods[i] !== "string") {
				throw new Error("定义接口中的方法必须为字符串类型");
			}
			this.methods.push(_methods[i]);
		}
	}
	
	return {
		/**
		 * 创建接口
		 * 如:var Book = createInterface(["getBookName","getPunishDate"]);
		 * @param:methods:接口中的方法数组类型 
		 * 
		 */
		createInterface : function(methods) {
			return new Interface(methods);
		}
		/**
		 * 继承原型
		 * 子类中调用父类的函数:
		 * Man.superclass.sayName.call(this);
		 * 子类中调用父类构造函数:
		 * Man.superclass.constructor.call(this,param);
		 * @param subClass 子类函数名
		 * @param superClass 父类函数名
		 */
		,extend:function(subClass,superClass){
			var F = function(){};
			F.prototype = superClass.prototype;
			subClass.prototype = new F();			
			subClass.prototype.constructor = subClass;
			
			subClass.superclass = superClass.prototype;
			if(superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;
			}
		}
		/**
		 * 实现接口
		 * implement(subClassInstance,interface1,interface2,...);
		 * @param subClassInstance 子类对象实例
		 */
		,implement:function(subClassInstance){			
			for(var i=1,len = arguments.length; i<len; i++) {
				var interfac = arguments[i];
				if(!interfac._isInterfaceType) {
					throw new Error("类必须实现接口类型");
				}
				for(var j=0,methodLen = interfac.methods.length; j<methodLen; j++) {
					var method = interfac.methods[j];
					if(!subClassInstance[method] 
						|| typeof subClassInstance[method] !== "function") {
						throw new Error("类没有实现接口中的[ " + method + " ]方法");
					}
				}
			}
		}
		/**
		 * 根据id获取dom节点
		 * @return 返回dom对象
		 */
		,getEl:function(id) {
			return doc.getElementById(id);
		}
	};
})();
