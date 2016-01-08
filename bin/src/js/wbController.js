(function() {
 'use strict'; 
 /**
 * Creates WBController to hold all features and functions for Whiteboard
 * @param {String} name 
 * @param {String} layers
 */
	///var scope;// SAME AS static dynamic var
	function Controller(name,layers) {
		this.name=name;
		this.actions= [];        //used to pool EVENTS/actions before rendering to fileoverview
				this.baseBG=null;
		this.baseDECK=null;
		this.baseSAND=null;
			this.baseBG  =	layers['cvsMAIN'];
			this.baseDECK=	layers['cvsDECK'];
			this.baseSAND=	layers['cvsSAND'];
		this.menu=null;
		
		this._username=null;
		
		this._currentdeckIndex=null;
		this.shapeNOW=null;		  	 //shape currently being used
		this._objectInit=null;			
		this._undoRange=null;        //Range for undo/redo
		this._isConnector=null;      //Boolean
		this._sandboxRect=null;      //sandboxArea 
		this._tempModel=null;
		
		this.setup();
	}
	
	
	
	function toTitleCase(str)
	{
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
		
	Controller.prototype= { 
		setName: function(uname){
			this._username=uname;
		},
		setMenu: function (menu){
			this.menu=menu;
			menu.addEventListener("MenuEvent", this.menuEventProxy.bind(this));
		},
		setLayers: function(layers){
			this.baseBG  =	layers['cvsMAIN'];
			this.baseDECK=	layers['cvsDECK'];
			this.baseSAND=	layers['cvsSAND'];
		},//drawinit function used to hold Option selected from menu
		drawinit: function(form,type,path){
			//create Shape
			this._objectInit=false;
			var modelIN={"classIn":form,"type":type,"path":path}
			this._tempModel = modelIN;
		},
		shapeTweenUpdate: function (form,pos){
			pos.alpha=0.5;
			createjs.Tween.get(owner.form, {override:true}).to({x:pos.x,y:pos.y,alpha:1},300,createjs.Ease.quadIn);
		},
		menuEventProxy: function (event){
			this.drawinit(event.param[0],event.param[1]);
		},
		shapeStart: function (){
			if (this.shapeNOW!=null){
				console.log("...found shape in use...");
					if (!this.shapeNOW._commited) {
						this.shapeNOW.drawPerm(this.shapeNOW,false);
					}
			}
			var mc = this.baseBG
			var type =this._tempModel.type;
			switch (this._tempModel.type) {
				case "select":
					break;
				case "ungroup":
					break;
				default:
					if (!this._objectInit){
						console.log(this._tempModel.classIn);
						var shape = new window["Form"+toTitleCase(this._tempModel.classIn)]("rcolvi_"+type, type)
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
		drawing: function (x,y){
			if (this._objectInit!=false){
				return;
			}
			//console.log("..drawing nwo");
			this.shapeNOW.drawTemp(x,y);		
		},
		drawdone: function (){
			console.log("...done nwo");
			this.shapeNOW.drawPerm(this.shapeNOW,false);
			this.shapeNOW=null;
		},
		clearObject: function(){
			
			this.shapeNOW=null;
		},
		setup: function() {
			console.log("wbController createDocumentFragment ====>?"+this.name);
			//add menu
			
			
		}
		
	};
	
	createjs.EventDispatcher.initialize(Controller.prototype);
	
	Controller.findDistance = function(){
		return 23;
	}
	
	function addListeners (shape,owner){
		shape.addEventListener("SelectEvent", onSelect.bind(owner));
		shape.addEventListener("CommitEvent", onCommit.bind(owner));
	}
	function onCommit(event){
		console.log("=========commited-========");
		console.log(event);	
	}
	function onSelect(event){
		console.log("=====aa  aa  aa====onSelect-========");
		console.log(event);	
		this.dispatchEvent(event);
	}


	window.Controller = createjs.promote(Controller, "Controller");
}());