(function(scope) {
 'use strict';
 	/**
	 * ...
	 * @author R Colvin
	 */
	///var scope;// SAME AS static dynamic var
	function WBoard(id, color ) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = color;
		this.layers= new Object();
		this.controller =null;
		
		//this.config=new WBdraw.ConfigWB(platform, width, height);
		this._currentdeckIndex=null;
		this.shapeNOW=null;		  	 //shape currently being used
		this._objectInit=null;			
		this._undoRange=null;        //Range for undo/redo
		this._isConnector=null;      //Boolean
		this._sandboxRect=null;      //sandboxArea 
		this._tempModel=null;
		
		this.setup();
	}
	var p = createjs.extend(WBoard, createjs.Container);
	
	p.getLayer = function (id){return this.layers[id];}	
		p.drawinit= function(owner,form,type,path){
			//create Shape
			owner._objectInit=false;
			var modelIN={"classIn":form,"type":type,"path":path}
			console.log("--------------------->>>    drawinit     ");
			console.log(modelIN);
			owner._tempModel = modelIN;
		}
		p.shapeTweenUpdate= function (form,pos){
			pos.alpha=0.5;
			createjs.Tween.get(owner.form, {override:true}).to({x:pos.x,y:pos.y,alpha:1},300,createjs.Ease.quadIn);
		},
		p.menuEventProxy=  function (event){
			console.log(".............menuEventProxy"+event);
			console.log(event.param[1]);
			this.drawinit(this,event.param[0],event.param[1]);
		},
		p.shapeStart=  function (){
			if (this.shapeNOW!=null){
				console.log("...found shape in use...");
					if (!this.shapeNOW._commited) {
						this.shapeNOW.drawPerm(this.shapeNOW,false);
					}
			}
			var mc = this.layers['cvsMAIN'];
			var type =this._tempModel.type;
			console.log("...dddddddddddddddddsss--------shape START------ssssssaaaaaaaaaa...");
			console.log(this._tempModel);
			switch (this._tempModel.type) {
				case "select":
					break;
				case "ungroup":
					break;
				default:
					if (!this._objectInit){
						window.WBdraw.trace("fffffffff     default      ffffffffff   Form"+window.WBdraw.toTitleCase(this._tempModel.classIn));
						var shape = new WBdraw["Form"+window.WBdraw.toTitleCase(this._tempModel.classIn)]("rcolvi_"+type, type)
						//var shape = new FormLine("rcolvi_"+type, type);
						console.log("Object in.."+mc);
						shape.x=mainStage.mouseX;
						shape.y=mainStage.mouseY;
						mc.addChild(shape);
						console.log("22Object in.."+this._tempModel.classIn);
						this.shapeNOW=shape;
						addListeners(shape,this);
						//noncommited event
					}
					
			}
		},
		p.drawing=  function (x,y){
			if (this._objectInit!=false){
				return;
			}
			//console.log("..drawing nwo");
			this.shapeNOW.drawTemp(x,y);		
		},
		p.drawdone=  function (owner){
			console.log("...done nwo"+p);
			owner.shapeNOW.drawPerm(owner.shapeNOW,false);
			owner.shapeNOW=null;
		},
		p.clearObject=  function(){
			
			this.shapeNOW=null;
		}
		

	
	
	p.setup = function() {
		
		var bg = new createjs.Shape();
		bg.alpha=1;
		bg.name=bg.id="bg";

		var DECK = new WBdraw.Box("cvsDECK", "#ccc", true);
		var MAIN = new WBdraw.Box("cvsMAIN", "#ccc", true);
		var SAND = new WBdraw.Box("cvsSAND", "#ccc", true);
		
		this.layers[DECK.id]=DECK;
		this.layers[MAIN.id]=MAIN;
		this.layers[SAND.id]=SAND;
		this.resizer= new WBdraw.FormResize("rsize","rtool");
		this.resizer.x=200;
		this.resizer.y=20;
		
		
		this.addChild(bg,DECK,MAIN,SAND,this.resizer);
		this.menu=new WBdraw.Menu("m1",this); 
		this.menu.addEventListener("MenuEvent", this.menuEventProxy.bind(this));
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
		this.shapeStart();
		this.on("pressmove", this.drawLine);
		event.stopImmediatePropagation();
	};
	p.handleRelease = function(event){
		this.drawdone(this);
		this.off("pressmove", this.drawLine);
	};
	
	
	// out of scope below
	p.drawLine = function(event){
		this.drawing(mainStage.mouseX,mainStage.mouseY);
	};
	p.endDraw = function(event){
		console.log("enddraw1");
		this.off("pressmove", this.drawLine);
	};
	
	
	p.test_draw = function(form,type){
		console.log("enddraw1");
		this.drawinit(this,form,type);
	};
	

	function onSelect(event){
		console.log(this.resizer);
		console.log("=========onSelect-=22222=======");
		this.resizer.handleRollOver(event);
		this.resizer.wrapTarget(this.resizer,event.param);
		//this.dispatchEvent(event);
	}
	
	
	function addListeners (shape,owner){
		shape.addEventListener("SelectEvent", onSelect.bind(owner));
		shape.addEventListener("CommitEvent", onCommit.bind(owner));
	}
	function onCommit(event){
		console.log("=========commited-========");
		console.log(event);	
	}


	
	createjs.EventDispatcher.initialize(WBoard.prototype);
	
	
	scope.WBoard = createjs.promote(WBoard, "Container");
	//scope.WBoard = WBoard;
	}(window.WBdraw))