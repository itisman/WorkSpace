/**
 * 窗体视图层
 * 2012-8-8
 * @private
 */
var FDWindowView = function(options) {
	FDWindowView.superclass.constructor.call(this,options);

	FDLib.dom.addClass(this.getPanelContentDiv(),'shadow');

	this._buildButtons();
	
	this._createBgModal();
	// 设置拖拽事件
	this.setDragable(this.options.dragable);
	
	this.setStyle('fdwindow');
}

FDLib.extend(FDWindowView,FDPanelView);

// zIndex初始值
FDWindowView.zIndex = 200;

/**
 * 获取下一个zIndex
 */
FDWindowView.getNextZ_Index = function() {
	return ++FDWindowView.zIndex;
}

/**
 * 打开窗体
 */
//@override
FDWindowView.prototype.show = function() {
	if(this.options.modal) {
		this.showBgModal();
	}
	// 放在showBgModal()后面,确保zIndex始终比遮罩层的大
	this.getPanelDiv().style.zIndex = FDWindowView.getNextZ_Index();
	this.getPanelDiv().style.display = '';
	
	this._runAfterShowHandler();
}

//@override
FDWindowView.prototype.close = function() {
	this.hideBgModal();
	this.getPanelDiv().style.display = 'none';
	this._runAfterCloseHandler();
}

FDWindowView.prototype.moveTo = function(left,top) {
	this.getPanelDiv().style.left = left + 'px';
    this.getPanelDiv().style.top = top + 'px';
}

FDWindowView.prototype.setDragable = function() {
	var titleDiv = this.getTitleDiv();
	if(this.couldMoveWindow()) {
		FDDragUtil.regist(this.getPanelDiv(),titleDiv);
		// 移到屏幕中央
		this.moveToCenter();
	}else{
		FDDragUtil.destory(titleDiv);
	}
}

FDWindowView.prototype.moveToCenter = function() {
	FDDragUtil.moveToCenter(this.getPanelDiv());
}

FDWindowView.prototype.couldMoveWindow = function() {
	return this.options.dragable;
}

FDWindowView.prototype.showBgModal = function() {
	this.bgModal.style.display = '';
	this.bgModal.style.zIndex = FDWindowView.getNextZ_Index();
}

FDWindowView.prototype.hideBgModal = function() {
	this.bgModal.style.display = 'none';
}

//@override
FDWindowView.prototype.buildPanel = function() {
	
	this._buildWindowPanel();
	
	this._setContentChild();
}

// 构建按钮
FDWindowView.prototype._buildButtons = function() {
	var buttons = this.options.buttons;
	var buttonsInstaces = [];
	if(FDLib.util.isArray(buttons)) {
		FDLib.util.each(buttons,function(button,i){
			if(!(button instanceof FDButton)) {
				button = new FDButton(button);
				buttons[i] = button;
			}
			buttonsInstaces.push(button);
		});
		
		this._appendButtons(buttonsInstaces);
	}
}

FDWindowView.prototype._appendButtons = function(buttonInstances) {
	if(buttonInstances.length > 0) {
		var doc = document;
		var buttonsDiv = doc.createElement(FDTag.DIV);
		var table = doc.createElement(FDTag.TABLE);
		var tbody = doc.createElement(FDTag.TBODY);
		buttonsDiv.className = 'fdwindow-button';
		table.appendChild(tbody);
		buttonsDiv.appendChild(table);
		var row = tbody.insertRow(0);
		var td = row.insertCell(0);
		td.setAttribute('align',this.options.buttonAlign);
		
		FDLib.util.each(buttonInstances,function(btnInstance){
			btnInstance.renderToDom(td);
		});
		
		this.getPanelContentDiv().appendChild(buttonsDiv);
	}
}

// 构建最外层div
FDWindowView.prototype._buildWindowPanel = function() {
	// 获取模板
	var panelFrameTemplate = this.getPanelDivTemplate();
	// 填充模板
	var panelHtml = FDLib.string.format(panelFrameTemplate
		,this._getTitleAndContentObj());

	this.getPanelDiv().innerHTML = panelHtml;
	
	document.body.appendChild(this.getPanelDiv());
}

// 设置窗体节点内容
FDWindowView.prototype._setContentChild = function() {
	var contDiv = FDLib.getEl(this.options.domId);
	if(!contDiv) {
		throw new Error('找不到窗体内容,请设置正确的domId');
	}
	this.appendContentChild(contDiv);
}

//@override
FDWindowView.prototype.getCloseArea = function() {
	if(this.options.closeable) {
		var area = new JString();
		var closeFunc = 'FDPanelView.panelMap['+this.panelCount+'].close()';
		area.append('<span class="close"><a href="javascript:void(0);" onclick="'+closeFunc+'">')
			.append(this.options.closeText)
			.append('</a></span>');
			
		return area.toString();
	}
	
	return '';
}

FDWindowView.prototype._createBgModal = function() {
	var doc = document;
	this.bgModal = doc.createElement(FDTag.DIV);
	
	var height = Math.max(doc.documentElement.clientHeight,doc.body.scrollHeight);
	var color = this.options.modelColor;
	var opacity = this.options.modelOpacity;
	
	this.bgModal.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:"+height+"px;filter:Alpha(Opacity=" + (opacity * 100) + ");opacity:"+opacity+";background-color:"+color+";";
	this.bgModal.style.display = 'none';
	
	document.body.appendChild(this.bgModal);
}

FDWindowView.prototype._runAfterShowHandler = function() {
	var afterShow = this.options.afterShow;
	if(FDLib.util.isFunction(afterShow)) {
		afterShow();
	}
}

FDWindowView.prototype._runAfterCloseHandler = function() {
	var afterClose = this.options.afterClose;
	if(FDLib.util.isFunction(afterClose)) {
		afterClose();
	}
}
