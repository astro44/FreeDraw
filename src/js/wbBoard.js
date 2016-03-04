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
		this.currentTab=0;
		this.allTabs={};
		
		//this.config=new WBdraw.ConfigWB(platform, width, height);
		this._currentdeckIndex=null;
		this.shapeNOW=null;		  	 //shape currently being used
		this._objectInit=null;			
		this._undoRange=null;        //Range for undo/redo
		this._isConnector=null;      //Boolean
		this._sandboxRect=null;      //sandboxArea 
		this._tempModel=null;
		this._isSynched=false;
		this._int=0;
		//action_delete=5;
		//action_create=1;
		//action_update=2;
		this.setup();
	}
	var p = createjs.extend(WBoard, createjs.Container);
	
	p.getLayer = function (id){return this.layers[id];}	
		p.drawinit= function(owner,form,type,path){
			//create modify Shape
			if (type==null || type=="")type=form;
			console.log("!@#@!!@###@@@====>>  form:"+form+" type:"+type);
			switch (form){
				case "modify":
					switch (type){
						case "delete":
							if (this.shapeNOW!=null){
								this.onDelete(this.shapeNOW,this.currentTab);
								this.shapeNOW=null;
							}
							break;
						case "color":
							break;
						case "alpha":
							break
					}
					break;
				case "clear":
						this.onDeleteAll(this.currentTab);
						this.shapeNOW=null;
					break;
				case "print":
					break;
				default:				
					owner._objectInit=false;
					
					var modelIN={"classIn":form,"type":type,"path":path}
					owner._tempModel = modelIN;
			}
		}
		p.shapeTweenUpdate= function (form,pos){
			pos.alpha=0.5;
			createjs.Tween.get(owner.form, {override:true}).to({x:pos.x,y:pos.y,alpha:1},300,createjs.Ease.quadIn);
		},
		p.menuEventProxy=  function (event){
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
			switch (this._tempModel.type) {
				case "select":
					break;
				case "ungroup":
					break;
				default:
					if (!this._objectInit){
						window.WBdraw.trace(" Form"+window.WBdraw.toTitleCase(this._tempModel.classIn));
						var nameIn="rcolvi_";
						if (!this._isSynched){
							nameIn+=this._int
							++this._int;
						}
						var shape = new WBdraw["Form"+window.WBdraw.toTitleCase(this._tempModel.classIn)](nameIn, type)
						//var shape = new FormLine("rcolvi_"+type, type);
						shape.x=mainStage.mouseX;
						shape.y=mainStage.mouseY;
						mc.addChild(shape);
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
			if (this.shapeNOW!=undefined){
				if (this.shapeNOW != this.resizer.formTarget){
					var lc= this.shapeNOW.bg.globalToLocal(x,y);
					this.shapeNOW.drawTemp(lc.x,lc.y);		
				}
			}
		},
		p.drawdone=  function (owner){
			window.WBdraw.trace("...done nwo",p);
			if (owner.shapeNOW!=undefined)
				owner.shapeNOW.drawPerm(owner.shapeNOW,false);
			if (owner.shapeNOW.type=="text"){
				if (owner.resizer.parent==undefined)
					owner.addChild(this.resizer);
					owner.resizer.wrapTarget(owner.resizer,owner.shapeNOW);
					owner.test_draw("line","free");
			}
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
		window.WBdraw.trace("8=====1====o");
		this.resizer= new WBdraw.FormResize("rsize","rtool");
		this.resizer.x=200;
		this.resizer.y=20;
		
		
		this.addChild(bg,DECK,MAIN,SAND);
		this.menu=new WBdraw.Menu("m1",this); 
		this.menu.addEventListener("MenuEvent", this.menuEventProxy.bind(this));
		this.addChild(this.menu); 
		
		this.on("click", this.handleClick.bind(this));
		this.on("mousedown", this.handlePress.bind(this));
		this.on("pressup", this.handleRelease.bind(this));
		
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
		window.WBdraw.trace("click1");
	};
	
	p.handlePress = function(event){
        //mainStage.addEventListener("stagemousemove", this.drawLine);
        //mainStage.addEventListener("stagemouseup", this.endDraw);
		console.log("pressing.33gfw...");
		this.shapeStart();
		this.on("pressmove", this.drawLine.bind(this));
		
		this.resizer.wrapTarget(this.resizer,null);
		event.stopImmediatePropagation();
	};
	p.handleRelease = function(event){
		this.drawdone(this);
		this.off("pressmove", this.drawLine);
	};
	
	
	// out of scope below
	p.drawLine = function(event){
		//console.log(".......drawline..........");
		this.drawing(mainStage.mouseX,mainStage.mouseY);
	};
	p.endDraw = function(event){
		window.WBdraw.trace("enddraw1");
		this.off("pressmove", this.drawLine);
		
	};
	
	
	p.test_draw = function(form,type){
		window.WBdraw.trace("enddraw1");
		this.drawinit(this,form,type);
	};
	p.onDelete=function(shape,tab,grouped){
		window.WBdraw.trace("8=========o");
		console.log(shape);
		if (!grouped)this.updateShape(shape,5,tab);
		if(shape.parent != null){
			console.log(shape.parent);
			shape.uncache();
			shape.parent.removeChild(shape);
			window.WBdraw.trace("<<<<=======o");
			delete shape;
		}
		this.resizer.wrapTarget(this.resizer,null);
	}
	p.onDeleteAll=function(tab){
		if (tab==this.currentTab){
			//remove from view
			window.WBdraw.trace("<removeAll>");
			var stot = this.allTabs[tab].length;
			for (var i =0;i<stot;++i){
				this.onDelete(this.allTabs[tab][i],tab,true);
			}
		}
		if (this.allTabs[tab]!=undefined)
			this.allTabs[tab].splice(0);
		//remove from memory the given tab
		//this.allTabs[0][childindex]  remove//
		//this.allTabs.splice(0);
	}

	p.updateShape = function(shape,action/*int*/,tab){
		//does tab exists?
		var found=false;
		console.log("~~~~!-updateShape-!~~~~"+tab);
		//if (tab==undefined)return;
		if (this.allTabs[tab]==undefined)this.allTabs[tab]=[];
		var tot=this.allTabs[tab].length;
		console.log(this.allTabs);
		console.log(this.allTabs[tab]);
		found=false;
		for (var i=0;i<tot;++i){
			if (this.allTabs[tab][i].name==shape.name){
				if(action==5){//DELETE
					this.allTabs[tab].splice(i,1);
				}else{
					this.allTabs[tab][i]=shape;
				}
				found=true;
				break;
			}
		}
		if (!found && action!=5){
			this.allTabs[tab].push(shape);
		}else if (action==5){
			console.log("see if event already exists in undo/redo with SAME timeStamp");
		}
	}
	

	function onSelect(event){
		window.WBdraw.trace(this.resizer);
		window.WBdraw.trace("=========onSelect-=22222=======");
		this.resizer.handleRollOver(event);
		if (this.resizer.parent==undefined)
			this.addChild(this.resizer);
		this.resizer.wrapTarget(this.resizer,event.param);
		console.log(event.param);
		this.shapeNOW = event.param
		//this.dispatchEvent(event);
	}
	
	
	
	function addListeners (shape,owner){
		shape.addEventListener("SelectEvent", onSelect.bind(owner));
		shape.addEventListener("CommitEvent", onCommit.bind(owner));
	}
	function onCommit(event){
		window.WBdraw.trace("=========commited-========"+this.currentTab);
		var shape = event.param;
		console.log(shape);
		shape._commited=true;
		//this.shapeNOW.parent.removeChild(this.shapeNOW);
		
		this.updateShape(shape,2,this.currentTab);
		//window.WBdraw.trace(event);	
	}



	
	createjs.EventDispatcher.initialize(WBoard.prototype);
	
	
	scope.WBoard = createjs.promote(WBoard, "Container");
	//scope.WBoard = WBoard;
	}(window.WBdraw))