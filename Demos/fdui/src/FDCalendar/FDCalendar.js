/**
 * 日历控件
 * @private
 * 2012-8-30
 */
var FDCalendar = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.dateUtil = FDLib.date;
	this.today = new Date();
	// 年月日
	this.date = new Date();	
	
	this.calendarDiv = document.createElement(FDTag.DIV);
	this.calendarDiv.style.display = "none";
	
	this.table = this._buildCalendarTable();
	this.thead = this.table.createTHead();
	this.tbody = document.createElement(FDTag.TBODY);
	this.tfoot = this.table.createTFoot();
	this.table.appendChild(this.tbody);
	
	this.calendarDiv.appendChild(this.table);
	
	
	this.selectedTD;
	this.hourSelector;
	this.minuteSelector;
	
	this._buildCalendarBody();
	
	this.setStyle('fd-calendar');
	
	this.renderToDom(document.body);
}

FDCalendar.FORMAT_YMD = "yyyy-MM-dd";
FDCalendar.FORMAT_YMDHMS = "yyyy-MM-dd hh:mm:ss";

FDCalendar.prototype = {
	getOptions:function() {
		return {
			weekTextArr:['日','一','二','三','四','五','六']
			// 显示日历的偏离量
			,offsetX:0
			,offsetY:20
			,format:FDCalendar.FORMAT_YMD
			// 方法参数:self.getValue(),target,self
			,onclick:null
			,onclear:null
			,isShowTime:false
			,dayRender:function(td,date) {return date;}
		};
	}
	/**
	 * 显示日历
	 * @param dom 点击dom显示日历
	 * @param value 日期值
	 */
	,show:function(dom,value) {
		this.setValue(value);
		this._setPosition(dom);
        this._showTimeOrNot();
        
		this.calendarDiv.style.display = "block";
	}
	/**
	 * 获取日历的div
	 */
	,getCalendarDom:function() {
		return this.calendarDiv;
	}
	,_setPosition:function(dom) {
		var offset = FDLib.dom.getOffset(dom);
        var options = this.options;
        
        this.calendarDiv.style.left = offset.left + options.offsetX + 'px';
        this.calendarDiv.style.top = offset.top + options.offsetY + 'px';
	}
	,_showTimeOrNot:function() {
		var isShowTime = this.options.isShowTime;
		if(isShowTime) {
			this.showTimeSelector();
		}else{
			this._hideTimeSelector();
		}
	}
	/**
	 * 隐藏日历控件
	 */
	,hide:function() {
		this.calendarDiv.style.display = "none";
	}
	/**
	 * 显示日历控件
	 */
	,showTimeSelector:function() {
		this._setHourMinute();
		this.hourSelector.show();
		this.minuteSelector.show();
	}
	,_hideTimeSelector:function() {
		this.hourSelector.hide();
		this.minuteSelector.hide();
	}
	/**
	 * 设置时间
	 * @param dateStr 字符串日期
	 */
	,setValue:function(dateStr) {
		var date;
		if(dateStr) {
			date = this.dateUtil.parse(dateStr);
		}else{
			date = new Date();
		}
		this.setValueDate(date);
	}
	/**
	 * 设置时间
	 * @param date Date类型日期
	 */
	,setValueDate:function(date) {
		this.date = date;
		this.refresh();
	}
	/**
	 * 获取日期值
	 */
	,getValue:function() {
		return this.dateUtil.format(this.date,this.options.format);
	}
	/**
	 * 获取年
	 */
	,getYear:function() {
		return this.date.getFullYear();
	}
	/**
	 * 获取月
	 */
	,getMonth:function() {
		return this.date.getMonth() + 1;
	}
	/**
	 * 获取日
	 */
	,getDate:function() {
		return this.date.getDate();
	}
	/**
	 * 获取小时
	 */
	,getHours:function() {
		return this.date.getHours();
	}
	/**
	 * 获取分钟
	 */
	,getMinutes:function() {
		return this.date.getMinutes();
	}
	/**
	 * 设置年
	 * @param year 年份,int型
	 */
	,setYear:function(year) {
		this.date.setYear(year);
	}
	/**
	 * 设置月
	 * @param month 月份1~12,int型
	 */
	,setMonth:function(month) {
		this.date.setMonth(month - 1);
	}
	/**
	 * 设置天
	 * @param date 天,int型
	 */
	,setDate:function(date) {
		this.date.setDate(date);
	}
	/**
	 * 设置小时
	 * @param hours 小时数,int型
	 */
	,setHours:function(hours) {
		this.date.setHours(hours);
	}
	/**
	 * 设置分钟
	 * @param hours 分钟数,int型
	 */
	,setMinutes:function(minutes) {
		this.date.setMinutes(minutes);
	}
	/**
	 * 设置秒
	 * @param second 秒,int型
	 */
	,setSeconds:function(second) {
		this.date.setSeconds(second);
	}
	/**
	 * 刷新
	 */
	,refresh:function() {
		this._refreshBody();
		this._buildCalendar();
	}
	/**
	 * 设置样式
	 * @param style className名
	 */
	,setStyle:function(style) {
		this.calendarDiv.className = style;
	}
	/**
	 * 定位到dom节点
	 */
	,renderToDom:function(dom) {
		dom.appendChild(this.calendarDiv);
	}
	/**
	 * 获取年月日对象
	 */
	,getYMDData:function() {
		return {year:this.getYear(),month:this.getMonth(),date:this.getDate()};
	}
	,_buildCalendarBody:function() {
		this._buildYearMonthSelectorRow();
		this._buildWeekTextRow();
		this._buildCalendarFoot();
	}
	,_refreshBody:function() {
		this.tbody.parentNode.removeChild(this.tbody);
		this.tbody = document.createElement(FDTag.TBODY);
		this.table.appendChild(this.tbody);
		this._initOnclickEvent();
		this._initMouseEvent();
	}
	,_buildCalendarTable:function() {
		var table = document.createElement(FDTag.TABLE);
		table.style.width = "100%";
		return table;
	}
	,_buildCalendarFoot:function() {
		var tr = this.tfoot.insertRow(0);
		var todayTr = this.tfoot.insertRow(1);
		this._buildTimeSelect(tr);
		this._buildOperateButton(todayTr);
	}
	,_buildTimeSelect:function(tr) {
		var cellIndex = 0;
		var td = tr.insertCell(0);
		td.setAttribute('colspan',7);
		td.setAttribute('align','center');
		
		this._buildHourSelect(tr,cellIndex++,td);
		this._buildMintSelect(tr,cellIndex++,td);
	}
	,_buildHourSelect:function(tr,cellIndex,td) {
		var self = this;
		var hourItems = this._buildTimeItems(24);
		this.hourSelector = new FDSelectBox({items:hourItems,isShowDefaultItem:false});
		this.hourSelector.setMsgText('时');
		this.hourSelector.addEvent('change',function(){
			self.setHours(self.hourSelector.getValue());
			self._runOnclickHandler(td);
		});
	
		this.hourSelector.renderToDom(td);
	}
	,_buildMintSelect:function(tr,cellIndex,td) {
		var self = this;
		var minItems = this._buildTimeItems(60);
		this.minuteSelector = new FDSelectBox({items:minItems,isShowDefaultItem:false});
		this.minuteSelector.setMsgText('分');
		this.minuteSelector.addEvent('change',function(){
			self.setMinutes(self.minuteSelector.getValue());
			self._runOnclickHandler(td);
		});
		
		this.minuteSelector.renderToDom(td);
	}
	,_buildOperateButton:function(tr) {
		var self = this;
		var td = tr.insertCell(0);
		td.setAttribute('colspan',7);
		td.setAttribute('align','center');
		this._buildTodayButton(td);
		this._buildClearButton(td);
	}
	,_buildTodayButton:function(td) {
		var self = this;
		this._buildButton(td,'今天',function(){
			self.setValueDate(new Date());
			if(self.options.isShowTime) {
				self._setHourMinute();
			}
			self._runOnclickHandler();
		});
	}
	,_setHourMinute:function() {
		this.setHours(this.hourSelector.getValue());
		this.setMinutes(this.minuteSelector.getValue());
		this.setSeconds(0);
	}
	,_buildClearButton:function(td) {
		var self = this;
		this._buildButton(td,'清空',function(){
			self._runOnclearHandler();
		});
	}
	,_buildTimeItems:function(val) {
		var items = [];
		for(var i=0; i<val; i++) {
			items.push({text:i,value:i});
		}
		
		return items;
	}
	,_initOnclickEvent:function() {
		var self = this;
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'TD'  // 子节点的类型
			,eventName:'click' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				var tdData = self._getTDData(target);
				if(tdData && target.innerHTML) {
					self._defaultOnclick(tdData,target);
					self._runOnclickHandler(target);
				}
			}
		});
	}
	,_initMouseEvent:function() {
		var self = this;
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'TD'  // 子节点的类型
			,eventName:'mouseover' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				if(target.innerHTML) {
					FDLib.dom.addClass(target,'calendar-hover');
				}
			}
		});
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'TD'  // 子节点的类型
			,eventName:'mouseout' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				FDLib.dom.removeClass(target,'calendar-hover');
			}
		});
	}
	,_defaultOnclick:function(tdData,td) {
		this.setDate(tdData.date);
		this._changeTdBgColor(td);
	}
	,_runOnclickHandler:function(target) {
		var clickHandler = this.options.onclick;
		if(FDLib.util.isFunction(clickHandler)) {
			clickHandler(this.getValue(),target,this);
		}
	}
	,_runOnclearHandler:function(target) {
		var clickHandler = this.options.onclear;
		if(FDLib.util.isFunction(clickHandler)) {
			clickHandler(this.getValue(),target,this);
		}
	}
	// 改变td背景色
	,_changeTdBgColor:function(nextTD) {
		if(this.selectedTD) {
			this.selectedTD.className = "unselected";
		}
		nextTD.className += " selected";
		this.selectedTD = nextTD;
	}
	,_buildCalendar:function() {
		var self = this;
		// 当月天数
		var daysInMonth = this.dateUtil.getEndDate(this.getYear(),this.getMonth());
		// 每月1号
		var firstDayOfMonth = new Date(this.getYear(),this.getMonth() - 1,1);
		// 每月1号星期几
		var firstDay = firstDayOfMonth.getUTCDay();
		// 今天
		var today = new Date();
		// 日期
		var dayIndex = 1;
		// 日期行的索引
		var rowIndex = 0;
		
		var thirdRow = this.tbody.insertRow(rowIndex++);
		
		// 填充空白天数
		for(var i=0;i<=firstDay;i++){
			thirdRow.insertCell(i);
		}
		// 填充第一个星期
		for (var i=firstDay + 1;i<=6;i++){
			this._buildTD(thirdRow,i,dayIndex++);
		}
		// 填充剩下的天数
		while (dayIndex <= daysInMonth) {
			
			var row = this.tbody.insertRow(rowIndex++)
			for (var i=0;i<=6 && dayIndex <= daysInMonth;i++){
				this._buildTD(row,i,dayIndex++);
			}
		}
		
		this._initYearMonthText();
	}
	,_buildTD:function(row,cellIndex,date) {
		var td = row.insertCell(cellIndex);
		td.innerHTML = this.options.dayRender(td,date);
		this._setTDData(td,date);
		// 如果是今天
		if(this._isReachToToday(date)) {
			td.className = "today";
			td.title = "今天";
		}
		if(this._isSelectedDay(td)) {
			this._changeTdBgColor(td);
		}
		
	}
	,_isReachToToday:function(date) {
		return this.today.getDate() == date 
				&& this.getMonth() == this.today.getMonth() + 1
				&& this.today.getFullYear() == this.getYear();
	}
	,_isSelectedDay:function(td) {
		var selectedTDData = this.getYMDData();
		var tdData = this._getTDData(td);
		return selectedTDData.year == tdData.year
			&& selectedTDData.month == tdData.month
			&& selectedTDData.date == tdData.date;
	}
	,_setTDData:function(td,date) {
		td.setAttribute('year',this.getYear());
		td.setAttribute('month',this.getMonth());
		td.setAttribute('date',date);
	}
	,_getTDData:function(td) {
		return {
			year:td.getAttribute('year')
			,month:td.getAttribute('month')
			,date:td.getAttribute('date')
		}
	}
	,_buildYearMonthSelectorRow:function() {
		this.yearMonthSelectorRow = this.thead.insertRow(0);
		var cellIndex = 0;
		this.preYearTD = this.yearMonthSelectorRow.insertCell(cellIndex++);
		this._setDayChangeTDStyle(this.preYearTD);
		this._buildPreYearButton(this.preYearTD);
		this.preMonthTD = this.yearMonthSelectorRow.insertCell(cellIndex++);
		this._setDayChangeTDStyle(this.preMonthTD);
		this._buildPreMonthButton(this.preMonthTD);
		
		this.yearMonthTxtTD = this.yearMonthSelectorRow.insertCell(cellIndex++);
		this.yearMonthTxtTD.className = "ym-txt";
		this.yearMonthTxtTD.setAttribute('colspan',3);
		
		this.nextMonthTD = this.yearMonthSelectorRow.insertCell(cellIndex++);
		this._setDayChangeTDStyle(this.nextMonthTD);
		this._buildNextMonthButton(this.nextMonthTD);
		this.nextYearTD = this.yearMonthSelectorRow.insertCell(cellIndex++);
		this._setDayChangeTDStyle(this.nextYearTD);
		this._buildNextYearButton(this.nextYearTD);
	}
	,_setDayChangeTDStyle:function(td) {
		td.className = 'day_change';
	}
	,_buildPreYearButton:function(td) {
		var self = this;
		var a = this._buildButton(td,'&lt;&lt;',function(){
			var nextMonth = self.getMonth();
			var nextYear = self.getYear() - 1;
			self._setNextMonthDate(nextYear,nextMonth);
			self.setYear(nextYear);
			self.refresh();
		});
		a.title = '上一年';
	}
	,_buildPreMonthButton:function(td) {
		var self = this;
		var a = this._buildButton(td,'&lt;',function(){
			var nextMonth = self.getMonth() - 1;
			var nextYear = self.getYear();
			nextMonth = nextMonth < 1 ? 12 : nextMonth;
			self._setNextMonthDate(nextYear,nextMonth);
			self.setMonth(nextMonth);
			self.refresh();
		});
		a.title = '上一月';
	}
	,_buildNextMonthButton:function(td) {
		var self = this;
		var a = this._buildButton(td,'&gt;',function(){
			var nextMonth = self.getMonth() + 1;
			var nextYear = self.getYear();
			nextMonth = nextMonth > 12 ? 1 : nextMonth;
			self._setNextMonthDate(nextYear,nextMonth);
			self.setMonth(nextMonth);
			self.refresh();
		});
		a.title = '下一月';
	}
	,_buildNextYearButton:function(td) {
		var self = this;
		var a = this._buildButton(td,'&gt;&gt;',function(){
			var nextMonth = self.getMonth();
			var nextYear = self.getYear() + 1;
			self._setNextMonthDate(nextYear,nextMonth);
			self.setYear(nextYear);
			self.refresh();
		});
		a.title = '下一年';
	}
	,_setNextMonthDate:function(year,nextMonth) {
		if(this.isEndDate()) {
			var endDate = this._getCurrentEndDate();
			var nextMonthEndDate = this.dateUtil.getEndDate(year,nextMonth);
			this.setDate(Math.min(endDate,nextMonthEndDate));
		}
	}
	/**
	 * 是否是当月最后一天
	 */
	,isEndDate:function() {
		var endDate = this._getCurrentEndDate();
		return this.getDate() == endDate;
	}
	,_getCurrentEndDate:function() {
		return this.dateUtil.getEndDate(this.getYear(),this.getMonth());
	}
	,_buildButton:function(td,txt,fn) {
		var a = document.createElement(FDTag.A);
		var self = this;
		a.href = "javascript:void(0);"
		a.innerHTML = txt;
		a.style.display = "inline-block";
		
		FDLib.event.addBatchEvent({
			superDom:a
			,tagName:'A' 
			,eventName:'click' 
			,handler:function(target) {  
				fn();
			}
		});
		
		td.appendChild(a);
		
		return a;
	}
	,_buildWeekTextRow:function() {
		var weekTextArr = this.options.weekTextArr;
		var weekTextRow = this.thead.insertRow(1);
		FDLib.util.each(weekTextArr,function(text,cellIndex){
			var weekTD = weekTextRow.insertCell(cellIndex);
			weekTD.innerHTML = text;
			weekTD.className = 'fdcalendar-week';
		});
	}
	,_initYearMonthText:function() {
		this._getYearMonthTextTD().innerHTML = this.getYear() + "年" + this.getMonth() + "月";
	}
	
	,_getYearMonthTextTD:function() {
		return this.yearMonthTxtTD;
	}
};
