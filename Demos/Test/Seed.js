(function (window, undefined) {
    var window = this,
    undefined,
    _jQuery = window.jQuery,
    _$ = window.$,
	
	jQuery = window.jQuery = window.$ = function(selector, context){
		return new jQuery.fn.init(selector, context);
	},

	quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
    isSimple = /^.[^:#\[\.,]*$/;
    
    jQuery.fn = jQuery.prototype = {
        init: function(selector, context){
            selector = selector || document;
            if(selector.nodeType){
                this[0] = selector;
                this.length = 1;
                this.context = selector;
                return this;
            }

            if(typeof selector === "string"){
                var match = quickExpr.exec(selector);
                if(match && (match[1] || !context)){
                    if(match[1])
                        selector = jQuery.clean([match[1]], context);
                    else{
                        var elem = document.getElementById(match[3]);
                        
                        if(elem && elem.id != match[3]){
                            return jQuery().find(selector);
                        }

                        var ret = jQuery(elem || []);
                        ret.context = document;
                        ret.selector = selector;
                        return ret;
                    }
                }else
                    return jQuery(context).find(selector);
            else if(jQuery.isFunction(selector))
                return jQuery(document).ready(selector);


                if(selector.selector && selector.context){
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return this.setArray(jQuery.isArray(selector)?
                        selector :
                        jQuery.makeArray(selector);
            }
        }
    }


})(window, undefined)
