(function() {
 'use strict';
 	/**
	 * ...
	 * @author R Colvin
	 */
	///var scope;// SAME AS static dynamic var
	function CanvasContainer(id, color ) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = color;
		this.layers= new Object();
		this.Controller =null;
		this.setup();
	}
	var p = createjs.extend(CanvasContainer, createjs.Container);
	
	p.getLayer = function (id){return this.layers[id];}

	p.setup = function() {
		
		var bg = new createjs.Shape();
		bg.alpha=1;
		bg.name=bg.id="bg";
		
		
		var DECK = new Box("cvsDECK", "#ccc", true);
		var MAIN = new Box("cvsMAIN", "#ccc", true);
		var SAND = new Box("cvsSAND", "#ccc", true);
		
		this.layers[DECK.id]=DECK;
		this.layers[MAIN.id]=MAIN;
		this.layers[SAND.id]=SAND;
		this.resizer= new FormResize("rsize","rtool");
		this.resizer.x=200;
		this.resizer.y=20;
		
		
		this.controller= new Controller("c1",this.layers);
		
		this.controller.addEventListener("SelectEvent", onSelect.bind(this));
		//this.controller={};
		this.addChild(bg,DECK,MAIN,SAND,this.resizer);
		this.menu=new Menu("m1",this.controller); 
		this.controller.setMenu(this.menu);
		this.addChild(this.menu); 
		this.on("click", this.handleClick);
		this.on("mousedown", this.handlePress);
		this.on("pressup", this.handleRelease);
		
		console.log("box1");
		//this.cursor = "pointer";
		//this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
		this.test_draw("line","free");
	};
	
	p.width=0;
	p.height=0;
	
	p.setSize = function (width,height,color){
		var bg=this.getChildByName("bg");
		console.log("resizeBy");//.beginFill('#'+Math.floor(Math.random()*16777215))
		bg.graphics.clear()
				.beginStroke('#ccc')
				.beginFill(color)
				.drawRect(0,0,width,height);
		
		for (var i in this.layers){
			this.layers[i].setSize(width,height,color);
		}
		p.width=width;
		p.height=height;
	};
	p.getWidth = function(){
		console.log("get width");
		return width;
	};
	p.wbRegister = function (wbid,tabid){
		
	}
	p.clear = function(type,wbid){
		//clear all objects in view based on type  ;
	}
	p.wbSwitch = function (wbid){
		
	}
	p.unshift =function(items){}//to front
	p.push =function(items){}//toback
	

	p.handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
		console.log("click1");
	};
	
	p.handlePress = function(event){
        //mainStage.addEventListener("stagemousemove", this.drawLine);
        //mainStage.addEventListener("stagemouseup", this.endDraw);
		console.log("pressing.33gfw...");
		this.controller.shapeStart();
		this.on("pressmove", this.drawLine);
		event.stopImmediatePropagation();
	};
	p.handleRelease = function(event){
		this.controller.drawdone();
		this.off("pressmove", this.drawLine);
	};
	
	
	// out of scope below
	p.drawLine = function(event){
		this.controller.drawing(mainStage.mouseX,mainStage.mouseY);
	};
	p.endDraw = function(event){
		console.log("enddraw1");
		this.off("pressmove", this.drawLine);
	};
	
	
	p.test_draw = function(form,type){
		console.log("enddraw1");
		this.controller.drawinit(form,type);
	};
	

	function onSelect(event){
		console.log(this.resizer);
		console.log("=========onSelect-=22222=======");
		this.resizer.handleRollOver(event);
		this.resizer.wrapTarget(this.resizer,event.param);
		//this.dispatchEvent(event);
	}

	window.CanvasContainer = createjs.promote(CanvasContainer, "Container");
	}());