// import { 
	// Rectangle,
	// Matrix2D,
	// Stage,
	// Ticker,
	// Touch,
	// Container,
	// Shape,
	// EventDispatcher,
	// Point
// } from "@createjs/easeljs"; 

// import { Tween } from "@createjs/tweenjs";

// import { extend, promote } from  '../../Utils'
// import ConfigWB from '../ConfigWB'
// import BrowserDetect from '../../BrowserDetect'


	/**
	 * FormProxy represents a transport form of the in memory objects for WBoard
	 */
	 
	function s(dude,no){
		console.log("hellow NO dude");
		this.segSize=3;
		
		this.id=this.name=null;
		this.color = EMPTY;
		this.type=null;
		this.label=EMPTY;
		this.status=EMPTY;
		this.tab=null;
		this.pod=null;
		this.x=0;
		this.y=0;
		this.regX = 0;
		this.regY = 0;
		this.type=EMPTY;
		this.points=EMPTY;
		this.related=EMPTY;
		this.biderectional=false;
		this.rotation = 0;
	} 
	//var s = {};
	
	var EMPTY="";
	s.NEW = 1;
	s.UPDATE = 2;
	s.DELETE = 3;
	s.CLEAR = 4;
	s.ORDER = 5;
	s.STATISTIC = 6;
	s.DELETE_SELECTABLE_AREA = 7;
	s.MOVED = 2;
	
	s.setup = function() {
	 
	
	// Public properties:
	}

/*
	s.isIE = function () {
		return s.browser == 'Explorer';
	};

	s.isVista = function() {
		return navigator.userAgent.indexOf('Windows NT 6.0') != -1;
	};

*/



// Public methods:

	/*s.init = function () {
		s.browser = s._searchString(s._dataBrowser) || "An unknown browser";
		s.version = s._searchVersion(navigator.userAgent) || s._searchVersion(navigator.appVersion) || "An unknown version";
		s.os = s._searchString(s._dataOS) || "An unknown OS";
	};*/

// Protected methods:
/*
	s._searchString = function (data) {
		for (var i = 0, l = data.length; i < l; i++) {
			var dataString = data[i].string;
			var dataProp = data[i].prop;

			s._versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1) { return data[i].identity; }
			} else if (dataProp) {
				return data[i].identity;
			}
		}
	};

	s._searchVersion = function (dataString) {
		var index = dataString.indexOf(s._versionSearchString);
		if (index == -1) { return; }
		return parseFloat(dataString.substring(index + s._versionSearchString.length + 1));
	};*/
	
	/**
	**static function only below
	**/
	s.flattenForm = function(flat,shape,tab){
		flat.id = flat.name=shape.name;
		flat.x = shape.x;
		flat.y = shape.y;
		flat.regX = shape.regX;
		flat.regY = shape.regY;
		flat.status = shape.status;
		flat.type = shape.type;
		flat.points = shape.points;
		flat.related = shape.related;
		flat.biderectional = shape.biderectional;
		flat.arrow = shape.arrow;
		flat.ball = shape.ball;
		flat.tab = tab;
		flat.pod = shape.pod;
		flat.label = shape.label;
		flat.rotation = shape.rotation;
		flat.class = shape.constructor.name.replace("Form","")
		// debugger
		return flat;
	}


	
	
	
// scope.FormProxy = s;
export default s;
//s.init(); // Auto init class.

