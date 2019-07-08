(function(scope) {
 'use strict';
	///var scope;// SAME AS static dynamic var
	function Box(id, color,  transparent) {
		this.Container_constructor();
		this.id=this.name=id;
		this.transparent=transparent;
		this.color = color;
		this.setup();
	}
	var p = createjs.extend(Box, createjs.Container);


	p.setup = function() {
		//var hitArea = new createjs.Shape();
		//hit.graphics.beginFill("#000").drawRect(0, 0, label2.getMeasuredWidth(), label2.getMeasuredHeight());
		//label2.hitArea = hit;
		
		var bg = new createjs.Shape();
		bg.snapToPixel=true;
		bg.alpha=1;
		bg.name=bg.id="bg";
		
	//	var v1 = new FormShape("m_id","ss","square","#FFF");
		
		
		//this.addChild(bg, v1); 
		this.on("click", this.handleClick);
		this.on("mousedown", this.handlePress);
		this.on("pressup", this.handleRelease);
		//this.on("pressmove", this.drawLine);
		
		console.log("box1");
		//this.cursor = "pointer";
		//this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
	};
	
	p.width=0;
	p.height=0;
	
	p.setSize = function (width,height,color){
		p.width=width;
		p.height=height;
		if (this.transparent)return;
		var bg=this.getChildByName("bg");
		console.log("resizerrrBy");//.beginFill('#'+Math.floor(Math.random()*16777215))
		bg.graphics.clear()
				.beginStroke('#ccc')
				.beginFill(color)
				.drawRect(0,0,width,height);
				
		this.cache(0,0,width,height);
	};
	p.getWidth = function(){
		console.log("get width");
		return width;
	};

	p.handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
		console.log("click");
		event.stopImmediatePropagation();
	};
	
	p.handlePress = function(event){
		console.log(event);
		console.log("press");
		//event.stopImmediatePropagation();
	};
	p.handleRelease = function(event){
		
		console.log("release");
		event.stopImmediatePropagation();
	};
	// out of scope below
	p.drawLine = function(event){
		console.log("draw");
		event.stopImmediatePropagation();
	};
	p.endDraw = function(event){
		console.log("enddraw");
		event.stopImmediatePropagation();
	};
	

	scope.Box = createjs.promote(Box, "Container");
}(window.WBdraw));