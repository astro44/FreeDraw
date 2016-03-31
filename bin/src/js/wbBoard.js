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
		this._pressMove=null;
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
								this.onDelete(this.shapeNOW,this.currentTab,false,false);
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
				console.log("...found shape in use..."+this.shapeNOW.id);
				if (!this.shapeNOW._commited) {
					if (this.shapeNOW.type!="links"){
						this.shapeNOW.drawPerm(this.shapeNOW,false);
					}else{
						this.onDelete(this.shapeNOW,this.currentTab,false,true);	
					}
				}
				this.shapeNOW=null;
			}
			console.log(this.shapeNOW);
			var type =this._tempModel.type;
			switch (this._tempModel.type) {
				case "select":
					break;
				case "ungroup":
					break;
				case "links":
					console.log("links[IN]");
					//if 
					break
				default:
					if (!this._objectInit){
						window.WBdraw.trace(" Form"+window.WBdraw.toTitleCase(this._tempModel.classIn));
						shapeCreate(this);
						//noncommited event
					}
					
			}
		},
		p.drawing=  function (x,y){
			if (this._objectInit!=false){
				return;
			}
			console.log("..drawing nwo");
			if (this.shapeNOW!=undefined){
				if (this.shapeNOW != this.resizer.formTarget){
					var lc= this.shapeNOW.bg.globalToLocal(x,y);
					this.shapeNOW.drawTemp(lc.x,lc.y);		
				}
			}
		},
		p.drawdone=  function (owner){
			window.WBdraw.trace("...done nwo",p);
			if (owner.shapeNOW!=undefined){
					owner.shapeNOW.drawPerm(owner.shapeNOW,false);
				if (owner.shapeNOW.type=="text"){
					if (owner.resizer.parent==undefined)
						owner.addChild(this.resizer);
						owner.resizer.wrapTarget(owner.resizer,owner.shapeNOW);
						owner.test_draw("line","free");
				}
			}
			owner.shapeNOW=null;
			
		},
		p.clearObject=  function(){
			
			this.shapeNOW=null;
		}
		

	
	
	p.setup = function() {
		
		var bg = new createjs.Shape();
		
		bg.snapToPixel=true;
		bg.alpha=1;
		bg.name=bg.id="bg";

		var DECK = new WBdraw.Box("cvsDECK", "#ccc", true);
		var MAIN = new WBdraw.Box("cvsMAIN", "#ccc", true);
		var SAND = new WBdraw.Box("cvsSAND", "#ccc", true);
		DECK.snapToPixel=true;
		MAIN.snapToPixel=true;
		SAND.snapToPixel=true;
		
		this.layers[DECK.id]=DECK;
		this.layers[MAIN.id]=MAIN;
		this.layers[SAND.id]=SAND;
		window.WBdraw.trace("8=====1====o");
		this.resizer= new WBdraw.FormResize("rsize","rtool");
		this.resizer.x=200;
		this.resizer.y=20;
		this.resizer.snapToPixel=true;
		
		
		this.addChild(bg,DECK,MAIN,SAND);
		this.menu=new WBdraw.Menu("m1",this); 
		this.menu.snapToPixel=true;
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
		
		this._pressMove = this.drawLine.bind(this);
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
		this.on("pressmove", this._pressMove);
		
		this.resizer.wrapTarget(this.resizer,null);
		event.stopImmediatePropagation();
	};
	p.handleRelease = function(event){
		this.drawdone(this);
		this.off("pressmove", this._pressMove);
	};
	
	
	// out of scope below
	p.drawLine = function(event){
		//console.log(".......drawline..........");
		this.drawing(mainStage.mouseX,mainStage.mouseY);
	};
	p.endDraw = function(event){
		window.WBdraw.trace("enddraw1");
		this.off("pressmove", this._pressMove);
	};
	
	
	p.test_draw = function(form,type){
		window.WBdraw.trace("enddraw1");
		this.drawinit(this,form,type);
	};
	/* when changing tabs fromJMS should be set to true
	** when deleting And requires update to fromJMS set to false
	*/
	p.onDelete=function(ss,tab,grouped,fromJMS){
		window.WBdraw.trace("8=========o");
		console.log(ss);
		if (ss == undefined){
			window.WBdraw.trace("<<<<<<<<<< undefined in DELETE >>>>>>>>>>");
			return;
		}
		var mc = this.layers['cvsMAIN'];
		var shape = mc.getChildByName(ss.name);
		if (!grouped)this.updateShape(shape,window.WBdraw.FormProxy.DELETE,tab);
		if (shape!=null){
			if(shape.parent != null){
				console.log(shape.parent);
				shape.destroy(fromJMS);
				window.WBdraw.trace("<<<<===delete...====o");
				shape.commit(window.WBdraw.FormProxy.DELETE);
				shape.removeAllEventListeners();
				shape.parent.removeChild(shape);
				delete shape;
			}
		}
		if (!fromJMS){//send commited event
			console.log("send to JMS server");
		}
		this.resizer.wrapTarget(this.resizer,null);
	}
	p.onDeleteAll=function(tab){
		if (tab==this.currentTab){
			//remove from view
			window.WBdraw.trace("< [START] removeAll>");
			console.log(this.allTabs);
			var stot = this.allTabs[tab].length;
			var i = this.allTabs[tab].length;
			while (this.allTabs[tab].length>0){
				console.log(this.allTabs[tab][i-1]);
				this.onDelete(this.allTabs[tab][i-1],tab,true,false);
				--i;
			}
		}
			window.WBdraw.trace("< [END] removeAll>");
			console.log(this.allTabs[tab]);
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
		if (shape==undefined){
			window.WBdraw.trace("<<<<<<<  [1] ???????????   >>>>>>>>>"+shape);
			window.WBdraw.trace("<<<<<<<<<<      >>>>>>>>>>");
			window.WBdraw.trace("<<<<<<<<<<      >>>>>>>>>>");
			window.WBdraw.trace("<<<<<<<<<< undefined in updateShape >>>>>>>>>>");
		}
		//if (tab==undefined)return;
		if (this.allTabs[tab]==undefined)this.allTabs[tab]=[];
		var tot=this.allTabs[tab].length;
		console.log(this.allTabs);
		console.log(this.allTabs[tab]);
		
		var flat = new window.WBdraw.FormProxy();
		window.WBdraw.FormProxy.flattenForm(flat,shape);
		if (flat==undefined){
			window.WBdraw.trace("     [2]   <<<<<<<   ???????????   >>>>>>>>>"+flat);
			window.WBdraw.trace("        <<<<<<<<<<      >>>>>>>>>>");
			window.WBdraw.trace("        <<<<<<<<<<      >>>>>>>>>>");
			window.WBdraw.trace("        <<<<<<<<<< undefined in updateShape >>>>>>>>>>");
		}
		for (var i=0;i<tot;++i){
			if (this.allTabs[tab][i].name==flat.name){
				if(action==window.WBdraw.FormProxy.DELETE){//DELETE
					this.allTabs[tab].splice(i,1);
				}else{
					this.allTabs[tab][i]=flat;
				}
				found=true;
				break;
			}
		}
		if (!found && action!=window.WBdraw.FormProxy.DELETE){
			this.allTabs[tab].push(flat);
		}else if (action==window.WBdraw.FormProxy.DELETE){
			console.log("see if event already exists in undo/redo with SAME timeStamp");
		}
	}
	/**
	** any links connected to SAME objects?
	**/
	p.uniqueLink = function (linkShape,tab){
		console.log("~~~~!-link check-!~~~~"+tab);
		//if (tab==undefined)return;
		if (this.allTabs[tab]==undefined)this.allTabs[tab]=[];
		var tot=this.allTabs[tab].length;
		var rin=linkShape.related;
		var rout=null;
		var curT=null;
		for (var i=0;i<tot;++i){
			if (this.allTabs[tab][i].type=="links" && this.allTabs[tab][i].id != linkShape.id){
				//could still be linked to similar object if connected to link
				curT = this.allTabs[tab][i];
				rout = curT.related;
				if (rin.to.id == curT.id || rin.from.id == curT.id){//it is connecting to another link /// NOW check to see if from or to objects R the same
					if (rin.from.id == rout.to.id || rin.from.id == rout.from.id || rin.to.id == rout.to.id || rin.to.id == rout.from.id){
						console.log("  @@!!@@!!@@found same And ITS A copy");
						return curT;
					}
				}	
				if (rout.from.id==rin.from.id || rout.from.id==rin.to.id){
					if (rout.to.id==rin.to.id || rout.to.id==rin.from.id){
						var link = this.allTabs[tab][i];
						if (rout.from.id!=rin.from.id){
							var mc = this.layers['cvsMAIN'];
							var sLink = mc.getChildByName(link.id);
							sLink.bidirection = link.bidirection = true;
							//sLink.drawPerm(sLink,false);
							sLink.moveLink(sLink, window.WBdraw.FormProxy.UPDATE);
						}
						console.log("  @@!!@@!!@@f should it be bidirectionl?");
						console.log(rout.from.id);
						console.log(rin.from.id);
						console.log(rin.to.id);
						console.log("  @@!---------____________--------!!@@");
						return link;
					}
				}
			}
		}
		return false;
	}
	

	
	function addListeners (shape,owner){
		shape.addEventListener("CommitEvent", onCommit.bind(owner));
		//shape.addEventListener("NONCommitEvent", onNONCommit.bind(owner));
		shape.addEventListener("PressEvent", onPress.bind(owner));
		shape.addEventListener("ReleaseEvent", onRelease.bind(owner));
		if (shape.type!="links")
			shape.on("pressmove", moveLocally.bind(owner));
	}
	
	/*function onNONCommit(event){
		
	}*/
	
	function moveLocally (evt){
		//console.log(evt);
		var shape = evt.currentTarget;
		if (this._tempModel.type=="links"){//You can't moveBy links... they Area tied down by binding objects
			return;
		}
		var newX=evt.stageX-shape.rel.x+shape.regX;
		var newY=evt.stageY-shape.rel.y+shape.regY;
		shape.x=newX;
		shape.y=newY;
		update=true;
		evt.stopImmediatePropagation();
		
	   var myevent = {
		 type: "MoveEvent",
		 param: shape
	   };
		shape.dispatchEvent(myevent);
		//console.log("..............");
	}
	function onCommit(event){
		window.WBdraw.trace("=========commited-========"+this.currentTab);
		var shape = event.param;
		console.log(shape);
		
		if (shape.type=="links" && event.action!=window.WBdraw.FormProxy.DELETE){//check to see if another link with SAME objects exists  
			var isCopy=this.uniqueLink(shape,this.currentTab);
			if (isCopy){//remove shape from Stage since its a copy
				window.WBdraw.trace("========= C O P Y ========");
				this.onDelete(shape,this.currentTab,false,true);//only delete locally fromJMS==true assumes server is up to Date.
				shape=isCopy;
			}
		}
		shape._commited=true;
		//this.shapeNOW.parent.removeChild(this.shapeNOW);
		
		this.updateShape(shape,event.action,this.currentTab);
		//window.WBdraw.trace(event);	
	}
	
	function onPress(event){
		window.WBdraw.trace("=========onPRESS-========"+this.currentTab);
		
		console.log("now target link to this shape if this is the type tool currently in use");
		console.log("skip the rest of the function if type == links");
		var shape = event.param;
		console.log("   ===>"+shape.id);
		if (this._tempModel.type=="links"){
			console.log("ola links just happened");
			var frshape = null;
			if (this.shapeNOW == null){
				frshape=shapeCreate(this);
				console.log("=========  ( A )");
			}else{
				if (this.shapeNOW.type=="links"){
					frshape = this.shapeNOW;
					console.log("=========  ( B )"+frshape);
					if (frshape.linked){//relationship complete create new NOW
						//frshape=shapeCreate(this);
						console.log("=========  ( C )");
					}				
				}else{//current shape is not links so create new oneshapeCreate
					frshape=shapeCreate(this);
					console.log("=========  ( D )");
				}
			}
			
			
			//this.on("pressmove", this.drawLine.bind(this));
			var finished=frshape.link(shape);
			if (finished){
				this.shapeNOW=null;
				mainStage.removeEventListener("stagemousemove", this._pressMove);
				return;
			}
			this.shapeNOW=frshape;
			frshape.x=shape.x;
			frshape.y=shape.y;
			mainStage.addEventListener("stagemousemove", this._pressMove);
			return;
		}
        mainStage.addEventListener("stagemouseup", shape.moveEND.bind(shape));
		if (!shape.scaled){
			createjs.Tween.get(shape,{override:true}).to({scaleX:1.05, scaleY:1.05},100,createjs.Ease.quadIn);
			shape.scaled=true;
			shape.rel2=new createjs.Point(mainStage.mouseX-shape.x,mainStage.mouseY-shape.y);
			shape.rel = new createjs.Point(shape.width*.5+shape.rel2.x,shape.height*.5+shape.rel2.y);
		}
	}
	/** ReleaseEvent is also selectevent**/
	function onRelease(event){
		window.WBdraw.trace("=========onRelease-========"+this.currentTab);
		
		var shape = event.param;
		if (this._tempModel.type=="links"){
			console.log("ola links just happened");
			return;
		}
        mainStage.removeEventListener("stagemousemove", shape.moveSTART);
        mainStage.removeEventListener("stagemouseup", shape.moveEND);
		

		window.WBdraw.trace(this.resizer);
		window.WBdraw.trace("=========onSelect-=22222=======");
		this.resizer.handleRollOver(event);
		if (this.resizer.parent==undefined)
			this.addChild(this.resizer);
		this.resizer.wrapTarget(this.resizer,shape);
		console.log(shape);
		this.shapeNOW = shape
	}
	
	function shapeCreate(owner){
		console.log("!!!!! create    !!!"+owner._tempModel.classIn);
		var mc = owner.layers['cvsMAIN'];
		var type =owner._tempModel.type
		var nameIn="rcolvi_";
		if (!owner._isSynched){
			nameIn+=owner._int
			++owner._int;
		}
		var shape = new WBdraw["Form"+window.WBdraw.toTitleCase(owner._tempModel.classIn)](nameIn, type)
		//var shape = new FormLine("rcolvi_"+type, type);
		shape.x=mainStage.mouseX;
		shape.y=mainStage.mouseY;
		mc.addChild(shape);
		owner.shapeNOW=shape;
		addListeners(shape,owner);	
		return shape;
	}


	
	createjs.EventDispatcher.initialize(WBoard.prototype);
	
	
	scope.WBoard = createjs.promote(WBoard, "Container");
	//scope.WBoard = WBoard;
	}(window.WBdraw))