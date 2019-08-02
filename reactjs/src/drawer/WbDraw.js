
	/**
	 * The WBdraw Object stores all the library classes.
	 * For example, to access the Common.proxy method, use:
	 * <pre>Atari.Common.proxy(method, scope);</pre>
	 * <br/><br/>
	 * The window.WBdraw package is passed into libraries as the "scope"
	 * @class WBdraw
	 */
	function WBdraw() {}
	
	var wb = WBdraw;
	wb.initialize = function(){
		console.log("say what?");
	}

	WBdraw.currentBoard = {};

	WBdraw.uname = "foxy";
	WBdraw.developerMode = true;

	WBdraw.toTitleCase= function(str){
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
    WBdraw.username_set = function(value) {
		 this.uname = value;
	}
    WBdraw.username = function() {
		return this.uname;
	}
	

	

    WBdraw.trace = function() {
	    if (WBdraw.developerMode === false) {
			//console.log("supress");
			return;
		}
	    var str = [];
        for(var i = 0, l = arguments.length; i < l; i++){
			str.push(arguments[i]);
        }
		try {
			console.log(str.join(" "));
		} catch (e) { }
    }

	/**
	 * JavaScript does not provide method closure, so a proxy function can be used
	 * to maintain method scope. Any parameters called on the resulting function will be passed
	 * into the callback.
	 * @param {Function} method The method to call
	 * @param {Object} scope The object to call the method on
	 * @return {Function} A delegate (proxy) function that will maintain the proper scope when it is called.
	 * @static
	 */
    WBdraw.proxy = function(method, scope) {
        return function() {
			if (WBdraw.developerMode === false) {
				try {
					return method.apply(scope, arguments);
				} catch(e) { }
			} else {
				return method.apply(scope, arguments);
			}
        }
    }

	/**
	 * Parse a JSON string into an object.
	 * @param {String} str The raw JSON-formatted string.
	 * @return {Object} The JavaScript-formatted object.
	 * @static
	 */
    WBdraw.parseJSON = function(str) {
        var result;
        try {
            result = JSON.parse(str);
        } catch (error) {
            WBdraw.trace("Error:", error); return null;
        }
        return result;
    }
	
	WBdraw.getCanvasDiv = function (newID){
		
		var oldDiv = document.getElementById(newID);
		if (oldDiv == null){
			console.log("$$$$$$ CREATE  CanvasTxt newID:"+newID);
			this.mainCanvas = document.getElementById("mainCanvas");
			var parentdiv = this.mainCanvas.parentNode;
			var newdiv = document.createElement('div');
			newdiv.setAttribute('id',newID);
			newdiv.style.zIndex=parentdiv.children.length;
			var lastdiv=parentdiv.children[0];
			parentdiv.insertBefore(newdiv,lastdiv);
			return newdiv
		}
		
			return oldDiv;
	}
	WBdraw.destroyCanvasDiv = function (divID){
		console.log("!!!!!!!!DESTROY");
		this.mainCanvas = document.getElementById("mainCanvas");
		var parentdiv = this.mainCanvas.parentNode;
		var oldDiv = document.getElementById(divID);
		parentdiv.removeChild(oldDiv);
	}

    export default WBdraw;
	// The WBdraw namespace is the only object stored on Window
	// console.log(scope);
	// scope.WBdraw = WBdraw;
	
	// console.log(scope.WBdraw);

