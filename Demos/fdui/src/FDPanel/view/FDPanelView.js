/**
 * 面板视图层
 * 2012-8-12
 * @private
 */
var FDPanelView = function(options) {
	this.options = options;
	this.panelCount = FDControl.generateCount();
	FDPanelView.panelMap[this.panelCount] = this;
	
	this.panelContentDivId = this.options.domId + '_panelContentDivId_' + this.panelCount;
	this.titleDivId = this.options.domId + '_titleDivId_' + this.panelCount;
	this.contentId = this.options.domId + '_contId_' + this.panelCount;
	this.titleId = this.options.domId + '_titleId_' + this.panelCount;
	
	
	this.panelDiv = document.createElement(FDTag.DIV);
	this.panelDiv.style.display = 'none';
	
	this.titleDiv;
	this.panelContentDiv;
	this.titleH3;
	
	this.buildPanel();
	
	this._setSize();
	
	this.setStyle('fdpanel');
	
	if(!this.isExpand()) {
		this.unexpand();
	}
}

FDPanelView.panelCount = 0;

FDPanelView.panelMap = {};


FDPanelView.prototype = {
	show:function() {
		this.panelDiv.style.display = '';
	}
	,close:function() {
		this.panelDiv.style.display = 'none';
	}
	,slideToggle:function() {
		if(this.isExpand()) {
			this.unexpand();
		}else{
			this.expand();
		}
	}
	,expand:function() {
		var target = this.getToggleTarget();
		this.getContentDiv().style.display = 'block';
		this.options.isExpand = true;
		target.innerHTML = '▲';
		target.title = "点击收缩";
	}
	,unexpand:function() {
		var target = this.getToggleTarget();
		this.getContentDiv().style.display = 'none';
		this.options.isExpand = false;
		target.innerHTML = '▼';
		target.title = "点击展开";
	}
	,isExpand:function() {
		var options = this.options;
		var isSlide = options.isSlide
		return !isSlide || (options.isExpand && isSlide);
	}
	,setWidth:function(width) {
		if(FDLib.util.isString(width)) {
			this.getTitleDiv().style.width = width;
			this.panelDiv.style.width = width;
		}
	}
	,setHeight:function(height) {
		if(FDLib.util.isString(height)) {
			this.getContentDiv().style.height = height;
		}
	}
	,setContent:function(content) {
		this.getContentDiv().innerHTML = content;
	}
	,appendContentChild:function(dom) {
		this.getContentDiv().appendChild(dom);
	}
	,getContentDiv:function() {
		return FDLib.getEl(this.contentId);
	}
	,getPanelDiv:function() {
		return this.panelDiv;
	}
	,setTitle:function(title) {
		if(!this.titleH3) {
			this.titleH3 = FDLib.getEl(this.titleId);
		}
		this.titleH3.innerHTML = title;
	}
	,getTitleDiv:function() {
		if(!this.titleDiv) {
			this.titleDiv = FDLib.getEl(this.titleDivId);
		}
		return this.titleDiv;
	}
	,getToggleTarget:function() {
		return this.getTitleDiv().getElementsByTagName('a')[0];
	}
	,getPanelContentDiv:function() {
		if(!this.panelContentDiv) {
			this.panelContentDiv = FDLib.getEl(this.panelContentDivId);
		}
		return this.panelContentDiv;
	}
	,setStyle:function(style) {
		if(FDLib.util.isString(style)) {
			this.panelDiv.className = style;
		}
	}
	,buildPanel:function() {
		this._initPanelDivHtml();
		
		var dom = this.getContentDom();
		// 在目标节点外层加个div
		wrap = FDLib.dom.wrap(dom,'<div></div>')
		// 克隆目标节点
		var domClone = dom.cloneNode(true);
		// 添加目标节点
		this.appendContentChild(domClone);
		// 替换目标节点
		wrap.replaceChild(this.panelDiv,dom);
	}
	,getContentDom:function() {
		var contDiv = FDLib.getEl(this.options.domId);
		if(!contDiv) {
			throw new Error('找不到窗体内容,请设置正确的domId,['+this.options.domId+']');
		}
		return contDiv;
	}
	,_initPanelDivHtml:function() {
		var panelFrameTemplate = this.getPanelDivTemplate();
		
		var panelHtml = FDLib.string.format(panelFrameTemplate
			,this._getTitleAndContentObj());
		
		this.panelDiv.innerHTML = panelHtml;
		
		document.body.appendChild(this.panelDiv);
	}
	,_setSize:function() {
		var width = this.options.width;
		var height = this.options.height;
		this.setWidth(width);
		this.setHeight(height);
	}
	,_getTitleAndContentObj:function() {
		return {
			title:this.options.title
			,closeArea:this.getCloseArea()
			,titleDivId:this.titleDivId
			,panelContentDivId:this.panelContentDivId
			,titleId:this.titleId
			,contentId:this.contentId
			,panelBoxId:this.panelBoxId
		};
	}
	,getCloseArea:function() {
		if(this.options.isSlide) {
			var area = new JString();
			var toggleFunc = 'FDPanelView.panelMap['+this.panelCount+'].slideToggle()';
			area.append('<span class="close"><a href="javascript:void(0);" title="点击收缩" onclick="'+toggleFunc+'">')
				.append('▲')
				.append('</a></span>');
			
			return area.toString();
		}
		
		return '';
	}
	,getPanelDivTemplate:function() {
		return FDPanelView.panelFrameTemplate;
	}
};

// 模板
FDPanelView.panelFrameTemplate = [
	'<div id="{panelContentDivId}" class="fd-content-box">'
		,'<div id="{titleDivId}" class="fdpanel-header">'
			,'<h3><span id="{titleId}">{title}</span>{closeArea}</h3>'
		,'</div>'
		,'<div id="{contentId}" class="section"></div>'
	,'</div>'
].join('');
