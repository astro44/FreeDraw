
(function(scope) {

	/**
	 * The WBdraw Object stores all the library classes.
	 * For example, to access the Common.proxy method, use:
	 * <pre>Atari.Common.proxy(method, scope);</pre>
	 * <br/><br/>
	 * The window.WBdraw package is passed into libraries as the "scope"
	 * @class WBdraw
	 */
	function WBdraw() {}
	
	var s = WBdraw;
	s.initialize = function(){
		console.log("say what?");
	}

	WBdraw.currentBoard = {};

	WBdraw.uname = "foxy";
	WBdraw.developerMode = true;

	WBdraw.toTitleCase= function(str){
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
    WBdraw.username_set = function(value) {
		 uname = value;
	}
    WBdraw.username = function() {
		return uname;
	}
	WBdraw.MidPoint= function( from, to ){
	  var xs = 0;
	  var ys = 0;
	  xs = to.x - from.x;
	  xs = xs * xs;
	  ys = to.y - from.y;
	  ys = ys * ys;
	  return Math.sqrt( xs + ys );
	}
	WBdraw.getContrast50 = function (hexcolor){
		return (parseInt(hexcolor.substring(1), 16) > 0xffffff/2) ? 'black':'white';
	}
	
	WBdraw.luma = function(hex/*#000000*/){
		//console.log(hex);//#61fbf1 //#88d66 //#92ae2 //#cf2f9
		var c = hex.substring(1);      // strip #
		var rgb = parseInt(c, 16);   // convert rrggbb to decimal
		var r = (rgb >> 16) & 0xff;  // extract red
		var g = (rgb >>  8) & 0xff;  // extract green
		var b = (rgb >>  0) & 0xff;  // extract blue
		return  0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
	}
    WBdraw.trace = function() {
	    if (WBdraw.developerMode == false) {
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
			if (WBdraw.developerMode == false) {
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

	// The WBdraw namespace is the only object stored on Window
	console.log(scope);
	scope.WBdraw = WBdraw;
	
	console.log(scope.WBdraw);

}(window))
