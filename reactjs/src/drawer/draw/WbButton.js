import { 
	// Rectangle,
	// Matrix2D,
	// Stage,
	// Ticker,
	// Touch,
	Container,
	Shape,
	// EventDispatcher,
    // Point,
    Text
} from "@createjs/easeljs"; 

// import { Tween } from "@createjs/tweenjs";

import {  promote } from  '../Utils'
// import ConfigWB from '../ConfigWB'
// import BrowserDetect from '../../BrowserDetect'
 
	class Button extends Container{
        constructor(id,icon,hint,label, color,invoke) {
            super();
		// this.Container_constructor();
		this.method=invoke
		this.color = color;
		this.label = label;
		this.name=this.id=id;
		this.hint=hint;
		this.icon=icon;
		this.type="btn";
		this.width=0;
		this.height=0;
		
		this.setup();
    }


	setup = function() {
		var luma = window.WBdraw.ConfigWB.luma(this.color);
		var tcolor = window.WBdraw.ConfigWB.getContrast50(this.color);
		//console.log(luma);
		if (luma < 130) {//very dark switch text color to white
			tcolor="#FFF";
		}
		var text = new Text(this.label, "20px Arial", tcolor);
		text.textBaseline = "top";
		text.textAlign = "center";
		
		this.width = text.getMeasuredWidth()+30;
		this.height = text.getMeasuredHeight()+20;
		
		text.x = this.width/2;
		text.y = 10;
		
		var background = new Shape();
		background.graphics.beginFill(this.color).drawRoundRect(0,0,this.width,this.height,10);
		//background.graphics.setStrokeStyle(5);
		//background.graphics.beginStroke("#000000");
		//background.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
		background.snapToPixel=true;
		text.snapToPixel=true;
		this.addChild(background, text); 
		this.on("click", this.handleClick);
		this.on("rollover", this.handleRollOver);
		this.on("rollout", this.handleRollOver);
		this.cursor = "pointer";

		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;
	
	

	handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
		this.method(this,this.id)
	} ;

	handleRollOver = function(event) {       
		this.alpha = event.type === "rollover" ? 0.4 : 1;
	};


}
	// var p = createjs.extend(Button, createjs.Container);
  

	// scope.Button = createjs.promote(Button, "Container");
    export default promote(Button, "Container")