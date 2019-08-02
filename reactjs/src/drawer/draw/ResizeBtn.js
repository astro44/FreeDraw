import { 
	// Rectangle,
	// Matrix2D,
	// Stage,
	// Ticker,
	// Touch,
	Container,
	Shape,
	// EventDispatcher,
	// Point
} from "@createjs/easeljs"; 

// import { Tween } from "@createjs/tweenjs";

import { promote } from  '../Utils'
// import ConfigWB from '../ConfigWB'
// import BrowserDetect from '../../BrowserDetect'


	class resizeBtn extends Container {
        constructor(id, color,invoke,revoke) {
            super();
		// this.Container_constructor();
		this.method=invoke
		this.methodStop=revoke
		this.color = color;
		this.name=this.id=id;
		this.type="btn";
		this.width=0;
		this.height=0;
		this.background=null;
		this.stroke=1;
		this.setup();
    }

	setup = function() {
		
		this.width = this.height = 30;
		
		
		this.background = new Shape();
		this.background.snapToPixel=true;
		this.background.graphics.beginStroke("#000");
		this.background.graphics.beginFill(this.color).drawCircle(0,0,this.height*.5);
		this.background.graphics.endFill();
		
		this.addChild(this.background); 
		
		//this.cache(0,0, this.width,this.width);
		this.cache(-this.width*.5-this.stroke,-this.width*.5-this.stroke, this.width+this.stroke*1.7,this.width+this.stroke*1.7);
		
		this.on("click", this.handleClick);
		this.on("mousedown", this.handlePress);
		//this.on("mousedown", this.handlePress);
		this.on("pressup", this.handleRelease);
		this.on("rollover", this.handleRollOver);
		this.on("rollout", this.handleRollOver);
		this.cursor = "pointer";

		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;
	
	resize = function(w,h){
		this.uncache();
		this.width = w;
		this.height = w;
		this.background.graphics.clear();
		this.background.graphics.beginStroke("#000");
		this.background.graphics.beginFill(this.color).drawEllipse(0, 0, w, h);
		this.background.graphics.endFill();
		this.background.x=-w*.5;
		this.background.y=-h*.5;
		this.cache(-this.width*.5-this.stroke,-this.height*.5-this.stroke, this.width+this.stroke,this.height+this.stroke);
	}
	
	
	handlePress = function(event){ 
		this.method(this,this.id)
		event.stopImmediatePropagation();
	};
	handleRelease = function(event){ 
		console.log("release");
		this.methodStop(this,this.id)
		event.stopImmediatePropagation();
	};

	handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
		//this.method(this,this.id)
		event.stopImmediatePropagation();
	} ;

	handleRollOver = function(event) {       
		this.alpha = event.type === "rollover" ? 0.4 : 1;
	};
}
	// var p = extend(resizeBtn, Container);



    // scope.resizeBtn = createjs.promote(resizeBtn, "Container");
    export default promote(resizeBtn, "Container")