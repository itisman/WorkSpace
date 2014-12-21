/**
 * Register and delete name space
 */

var Namespace = {
		reg : function(s){
			var arr = s.split('.');
			var namespace = window;
			for(var i=0, k=arr.length;i<k;i++){
				if(typeof namespace[arr[i] == "undefined"]){
					namespace[arr[i]] = {};
				}
				
				namespace = namespace[arr[i]];
			}
		},
		del : function(s){
			var arr = s.split(".");
			var namespace = window;
			for(var i=0,k=arr.length;i<k;i++){
				if(typeof namespace[arr[i]] == "undefined"){
					return;
				}else if(k == i + 1){
					delete namespace[arr[i]];
					return;
				}else{
					namespace = namespace[arr[i]];
				}
			}
			
		},
		
		require : function(url, callback){
			var header = document.getElementsByTagName("head")[0]; 
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url;
			
			script.onload = callback;
			script.onreadystatechange = callback;			

			header.appendChild(script);			
		}
		
};