 

    import { 
        Point,
        Matrix2D,
        // Stage,
        // Ticker,
        // Touch,
        Container,
        Shape,
		EventDispatcher,
		Bitmap
    } from "@createjs/easeljs"; 

    import { Tween } from "@createjs/tweenjs";

    import WbFormFill from './forms/wbFormFill'
    import wbFormLine from './forms/wbFormLine'
    import wbFormProxy from './forms/wbFormProxy'
    import wbFormResizer from './forms/wbFormResizer'
    import wbFormShape from './forms/wbFormShape'
    import wbFormText from './forms/wbFormText'
    import WbBox from './WbBox'
    import WbMenu from './WbMenu'
	
	import Trace from '../Trace'
    // import { quadIn } from "@createjs/easeljs";

 	/**
	 * ...
	 * @author R Colvin
	 */
    import { promote, toTitleCase } from  '../Utils'

    const Forms = {
        FormFill:WbFormFill,
        FormLine:wbFormLine,
        FormProxy:wbFormProxy,
        FormResizer:wbFormResizer,
        FormShape:wbFormShape,
        FormText:wbFormText,
    }

	
	///var scope;// SAME AS static dynamic var
	class  WBoard extends Container{
        constructor(id, color ) {
            super();
        // _inheritsLoose(WBoard, Container);
		// this.Container_constructor();
		this.id=this.name=id;
		this.color = color;
		this.layers= {};
		this.controller =null;
		this.currentTab=0;
		this.allTabs={};
		this.mainStage= null;
		//this.config=new WBdraw.ConfigWB(platform, width, height);
		this._currentdeckIndex=null;
		this._shapeNOW=null;		  	 //shape currently being used
		Object.defineProperty(this, "shapeNOW", { 
			get: function() { return this._shapeNOW; },
			set: function (shape) {
				this._shapeNOW = shape;
				this.notifyShapeNOW(this._shapeNOW)
			}
		});

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
		this.observersShapeNOW = [];
		this.setup();
    }
    
	subscribeShapeNOW = function (f) {
		this.observersShapeNOW.push(f);
	}

	// add the ability to unsubscribe from a particular object
	// essentially, remove something from the observersShapeNOW array
	unsubscribeShapeNOW = function (f) {
		this.observersShapeNOW = this.observersShapeNOW.filter(subscriber => subscriber !== f);
	}

	// update all subscribed objects / DOM elements
	// and pass some data to each of them
	notifyShapeNOW = function (data) {
		this.observersShapeNOW.forEach(observer => observer(data));
	}
	getLayer = function (id){return this.layers[id];}	
		drawinit= function(owner,form,type,path){
			//create modify Shape
			if (type==null || type==="")type=form;
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
                        default:
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
		shapeTweenUpdate= function (form,pos){
			pos.alpha=0.5;
			Tween.get(
                form, {override:true})
                .to(
                    {
                        x:pos.x,
                        y:pos.y,
                        alpha:1
                    },
                    300,
                    // createjs.Ease.quadIn
                );
        }
        
		menuEventProxy=  function (event){
			this.drawinit(this,event.param[0],event.param[1]);
        }
        
		shapeStart=  function (){
			if (this.shapeNOW!=null){
				console.log("...found shape in use..."+this.shapeNOW.id);
				if (!this.shapeNOW._commited) {
					if (this.shapeNOW.type!=="links"){
						this.shapeNOW.drawPerm(this.shapeNOW,false);
					}else{
						this.onDelete(this.shapeNOW,this.currentTab,false,true);	
					}
				}
				this.shapeNOW=null;
			}
			console.log(this.shapeNOW);
			// var type =this._tempModel.type;
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
						Trace(" Form"+toTitleCase(this._tempModel.classIn));
						shapeCreate(this);
						//noncommited event
					}
					
			}
        }
        
		drawing=  function (x,y){
			if (this._objectInit!==false){
				return;
			}
			console.log("..drawing nwo");
			console.log(this.shapeNOW);
			if (this.shapeNOW){
				if (this.shapeNOW !== this.resizer.formTarget){
					var lc= this.shapeNOW.bg.globalToLocal(x,y);
					this.shapeNOW.drawTemp(lc.x,lc.y);		
				}
			}
        }
        
		drawdone=  function (owner){
			Trace("...done nwo",this);
			if (owner.shapeNOW){
					owner.shapeNOW.drawPerm(owner.shapeNOW,false);
				if (owner.shapeNOW.type==="text"){
                    if (owner.resizer.parent===undefined || owner.resizer.parent===null)
						owner.addChild(this.resizer);
						owner.resizer.wrapTarget(owner.resizer,owner.shapeNOW);
						owner.test_draw("line","free");
				}
			}
			owner.shapeNOW=null;
			
        }
        
		clearObject=  function(){
			
			this.shapeNOW=null;
		}
		

	
	
	setup = function() {
		
		var bg = new Shape();
		
		bg.snapToPixel=true;
		bg.alpha=1;
		bg.name=bg.id="bg";

		var DECK = new WbBox("cvsDECK", "#ccc", true);
		var MAIN = new WbBox("cvsMAIN", "#ccc", true);
		var SAND = new WbBox("cvsSAND", "#ccc", true);
		DECK.snapToPixel=true;
		MAIN.snapToPixel=true;
		SAND.snapToPixel=true;

		// var shape = new WBdraw["FormFill"]("sasas32", "square")
		// //var shape = new FormLine("rcolvi_"+type, type);
		// shape.x=50;
		// shape.y=50;
		// shape.drawTemp(300, 300);
		// addListeners(shape,this);
		// console.log("SHAPPPEEEEEEE",{shape})
		// MAIN.addChild(shape);
		
		


		this.layers[DECK.id]=DECK;
		this.layers[MAIN.id]=MAIN;
		this.layers[SAND.id]=SAND;
		Trace("8=====1====o");
		this.resizer= new Forms.FormResizer("rsize","rtool");
		this.resizer.x=200;
		this.resizer.y=20;
		this.resizer.snapToPixel=true;
		
		this.image = new Shape();
		this.addChild(this.image)

		this.addChild(bg,DECK,MAIN,SAND);
		this.menu=new WbMenu("m1",this); 
		this.menu.snapToPixel=true;
		this.menu.addEventListener("MenuEvent", this.menuEventProxy.bind(this));
		// this.addChild(this.menu); 
		
		this.on("click", this.handleClick.bind(this));
		this.on("mousedown", this.handlePress.bind(this));
		this.on("pressup", this.handleRelease.bind(this));
		
		//this.cursor = "pointer";
		//this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
		this.test_draw("line","free");
		
		this._pressMove = this.drawLine.bind(this);

		var self = this;
		// function loadImg(uri) {
		// 	var image = document.createElement("img")
		// 	image.crossOrigin = "Anonymous"
		// 	image.src = uri 
		// 	return image
		//   }
		// var img = new createjs.Bitmap(loadImg("https://nc-portal-dev.nuclaim.com/ale/branches/744/files/logo.jpg"))  
		// debugger
		// var img = new Image();
		// img.crossOrigin = "Anonymous";
		// img.src = "https://nc-portal-dev.nuclaim.com/ale/clients/309/files/logo.gif";
		// // img.src = "/Homer_Simpson_2006.png";
		// img.onload = function () {
		// 	// self.img=img;
			

		// 	var m = new Matrix2D();
		// 	m.translate(self.width/2 -img.width/2, 0);
		// 	// m.scale(self.width/img.width, self.height/img.height);
			
		// 	self.image.graphics.beginBitmapFill(img, "no-repeat");
		// 	self.image.graphics.drawRect(0, 0,img.width,img.height);
		// 	self.image.x = self.width/2;
		// 	self.image.y = img.height/2;
		// 	self.image.regX = img.width/2;
		// 	self.image.regY = img.height/2;
		// 	self.image.element = img;
		// 	document.image = self.image;
		// }
		
	};
	setImage = function(img){
		// var m = new Matrix2D();
		// m.translate(img.width/2, img.height/2);
		// m.scale(img.width,img.height);
		
		this.image.graphics.beginBitmapFill(img, "no-repeat");
		this.image.graphics.drawRect(0, 0,img.width,img.height);
		this.image.x = img.width/2;
		this.image.y = img.height/2;
		this.image.regX = img.width/2;
		this.image.regY = img.height/2;
		this.image.element = img;
		document.image = this.image;
		
	}
	width=0;
	height=0;
	getImage = function(){
		return this.image;
	}
	setSize = function (width,height,color){
		var bg=this.getChildByName("bg");
		console.log("resizeBy");//.beginFill('#'+Math.floor(Math.random()*16777215))

		if (this.img) {
			var m = new Matrix2D();
			// m.translate(inX, inY);
			m.scale(width/this.img.width, height/this.img.height);
	
			// MC.beginBitmapFill(owner.img,"no-repeat"); 
	
			bg.graphics.clear()
					.beginStroke('#ccc')
					// .beginFill(color)
					.beginFill('#F2314B')
					.beginBitmapFill(this.img)
					// .beginFill('#11F2314B')
					.drawRect(0,0,width,height);
		}else{
			bg.graphics.clear()
					.beginStroke('#ccc')
					// .beginFill(color)
					.beginFill('#fff')
					.drawRect(0,0,width,height);
					bg.alpha = 0.01;

		}
		
		for (var i in this.layers){
			this.layers[i].setSize(width,height,color);
		}
		this.width=width;
		this.height=height;
	};
	getWidth = function(){
		console.log("get width");
		return this.width;
	};
	wbRegister = function (wbid,tabid){
		
	}
	clear = function(type,wbid){
		//clear all objects in view based on type  ;
	}
	wbSwitch = function (wbid){
		// debugger
		const currentTab = this.currentTab
		const mc = this.layers['cvsMAIN'];
		const { [currentTab]:oldTab=[] } = this.allTabs

		for (let iss = 0; iss < oldTab.length; iss++) {
			const ss = oldTab[iss];
			
			var shape = mc.getChildByName(ss.name);
			if (shape!=null){
				if(shape.parent != null){
					shape.removeAllEventListeners();
					shape.parent.removeChild(shape);
				}
			}
		}
		this.currentTab = wbid
		
		const { [wbid]:tab=[] } = this.allTabs

		const tot = tab.length
		for (let i=0;i<tot; ++i){
			const shape=tab[i];
			const classIn = shape['class']
			const type = shape['type']
			const nameIn = shape['name']
			
			this.shapeInsert(this,classIn,type,nameIn,shape)
		}
	}
	unshift =function(items){}//to front
	push =function(items){}//toback
	

	handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
		Trace("click1");
	};
	
	handlePress = function(event){
        //mainStage.addEventListener("stagemousemove", this.drawLine);
        //mainStage.addEventListener("stagemouseup", this.endDraw);
		console.log("pressing.33gfw...");
		
		this.shapeStart();
		this.on("pressmove", this._pressMove);
		if (this.resizer.EMPTY()){
			if (this.shapeNOW.id===this.resizer.formTarget.id)
				this.shapeNOW=null;
			//this.resizer.formTarget.action=
			this.onDelete(this.resizer.formTarget,this.currentTab,false,false);
		}
		this.resizer.wrapTarget(this.resizer,null);
		event.stopImmediatePropagation();
	};
	handleRelease = function(event){
		this.drawdone(this);
		this.off("pressmove", this._pressMove);
	};
	
	
	// out of scope below
	drawLine = function(event){
		//console.log(".......drawline..........");
		this.drawing(this.mainStage.mouseX,this.mainStage.mouseY);
	};
	endDraw = function(event){
		Trace("enddraw1");
		this.off("pressmove", this._pressMove);
	};
	
	
	test_draw = function(form,type){
		Trace("enddraw1");
		this.drawinit(this,form,type);
	};
	/* when changing tabs fromJMS should be set to true
	** when deleting And requires update to fromJMS set to false
	*/
	onDelete=function(ss,tab,grouped,fromJMS){
		Trace("8=========o");
		console.log(ss);
		if (ss === undefined || ss === null){
			Trace("<<<<<<<<<< undefined in DELETE >>>>>>>>>>");
			return;
		}
		var mc = this.layers['cvsMAIN'];
		var shape = mc.getChildByName(ss.name);
		if (!grouped)this.updateShape(shape,wbFormProxy.DELETE,tab);
		if (shape!=null){
			if(shape.parent != null){
				console.log(shape.parent);
				shape.destroy(fromJMS);
				Trace("<<<<===delete...====o");
				shape.commit(wbFormProxy.DELETE);
				shape.removeAllEventListeners();
				shape.parent.removeChild(shape);
                // delete 
				shape = null; //************************************************************************************************************************
			}
		}
		if (!fromJMS){//send commited event
			console.log("send to JMS server");
		}
		this.resizer.wrapTarget(this.resizer,null);
	}
	onDeleteAll=function(tab){
		if (tab===this.currentTab){
			//remove from view
			Trace("< [START] removeAll>");
			console.log(this.allTabs);
			// var stot = this.allTabs[tab].length;
			var i = this.allTabs[tab].length;
			while (this.allTabs[tab].length>0){
				// debugger
				console.log(this.allTabs[tab][i-1]);
				this.onDelete(this.allTabs[tab][i-1],tab,true,false);
				--i;
			}
		}
			Trace("< [END] removeAll>");
			console.log(this.allTabs[tab]);
		if (this.allTabs[tab]!==undefined && this.allTabs[tab]!==null)
			this.allTabs[tab].splice(0);
		//remove from memory the given tab
		//this.allTabs[0][childindex]  remove//
		//this.allTabs.splice(0);
	}


	wbImport=function(wbList){
		// debugger
		var tot = wbList.length;
		for (var i=0;i<tot; ++i){ //create each virtual tab....
			var items=wbList[i];
			var itot=items.length;
			// var currTab = i;
			for (var j=0;j<itot;++j){
				var cTab = wbList[i][j].tab
				var shape=wbList[i][j];
				var action=wbFormProxy.NEW
				this.updateShape(shape,action,cTab);
			}
		} 

		var tab = wbList[0]
		tot = tab.length
		for (let i=0;i<tot; ++i){
			let shape=tab[i];
			var classIn = shape['class']
			var type = shape['type']
			var nameIn = shape['name']
			
			this.shapeInsert(this,classIn,type,nameIn,shape)
		}
	}

	shapeInsert = function (owner,classIn,type,nameIn, obj){
		var mc = owner.layers['cvsMAIN'];
		// var nameIn="rcolvi_";
		// if (!owner._isSynched){
		// 	nameIn+=owner._int
		// 	++owner._int;
		// }
		console.log("this.mainStage----->>>",this.mainStage)
		var shape = new Forms["Form"+toTitleCase(classIn)](nameIn, type, this.mainStage)
		if (classIn==="Line" || classIn==="Fill"){
			shape.points=obj.points
		}
		if (type==="links"){
			shape.related=obj.related
		}
		if (classIn==="Text"){
			shape.setText(obj.label);
		}
		shape.pos =obj.points
		// debugger
		
		shape.drawPerm(shape,false);

		shape.regX=obj.regX;
		shape.regY=obj.regY;
		shape.x=obj.x;
		shape.y=obj.y;
		shape.rotation=obj.rotation;

		// if (owner.shapeNOW.type=="text"){119.89.134.108
		// 	if (owner.resizer.parent==undefined)
		// 		owner.addChild(this.resizer);
		// 		owner.resizer.wrapTarget(owner.resizer,owner.shapeNOW);
		// 		owner.test_draw("line","free");
				
		// }
		//var shape = new FormLine("rcolvi_"+type, type);
		mc.addChild(shape);
		addListeners(shape,owner);
		return shape;
	}
	updateShape = function(shape,action/*int*/,tab){
		//does tab exists?
		var found=false;
		console.log("~~~~!-updateShape-!~~~~"+tab);
		if (shape===undefined || shape===null){
			Trace("<<<<<<<  [1] ???????????   >>>>>>>>>"+shape);
			Trace("<<<<<<<<<<      >>>>>>>>>>");
			Trace("<<<<<<<<<<      >>>>>>>>>>");
			Trace("<<<<<<<<<< undefined in updateShape >>>>>>>>>>");
		}
		if (this.allTabs[tab]===undefined || this.allTabs[tab]===null)this.allTabs[tab]=[];
		var tot=this.allTabs[tab].length;
		console.log(this.allTabs);
		console.log(this.allTabs[tab]);
		
		var flat = new wbFormProxy();
		wbFormProxy.flattenForm(flat,shape,tab);
		if (flat===undefined || flat===null){
			Trace("     [2]   <<<<<<<   ???????????   >>>>>>>>>"+flat);
			Trace("        <<<<<<<<<<      >>>>>>>>>>");
			Trace("        <<<<<<<<<<      >>>>>>>>>>");
			Trace("        <<<<<<<<<< undefined in updateShape >>>>>>>>>>");
		}
		for (var i=0;i<tot;++i){
			if (this.allTabs[tab][i].name===flat.name){
				if(action===wbFormProxy.DELETE){//DELETE
					this.allTabs[tab].splice(i,1);
				}else{
					this.allTabs[tab][i]=flat;
				}
				found=true;
				break;
			}
		}
		if (!found && action!==wbFormProxy.DELETE){
			this.allTabs[tab].push(flat);
		}else if (action===wbFormProxy.DELETE){
			console.log("see if event already exists in undo/redo with SAME timeStamp");
			//console.log(shape);
			//console.log(this.allTabs[tab]);
		}
	}
	/**
	** any links connected to SAME objects?
	**/
	uniqueLink = function (linkShape,tab){
		console.log("~~~~!-link check-!~~~~"+tab);
		if (this.allTabs[tab]===undefined || this.allTabs[tab]===null)this.allTabs[tab]=[];
		var tot=this.allTabs[tab].length;
		var rin=linkShape.related;
		var rout=null;
		var curT=null;
		for (var i=0;i<tot;++i){
			if (this.allTabs[tab][i].type==="links" && this.allTabs[tab][i].id !== linkShape.id){
				//could still be linked to similar object if connected to link
				curT = this.allTabs[tab][i];
				rout = curT.related;
				if (rin.to.id === curT.id || rin.from.id === curT.id){//it is connecting to another link /// NOW check to see if from or to objects R the same
					if (rin.from.id === rout.to.id || rin.from.id === rout.from.id || rin.to.id === rout.to.id || rin.to.id === rout.from.id){
						console.log("  @@!!@@!!@@found same And ITS A copy");
						return curT;
					}
				}	
				if (rout.from.id===rin.from.id || rout.from.id===rin.to.id){
					if (rout.to.id===rin.to.id || rout.to.id===rin.from.id){
						var link = this.allTabs[tab][i];
						if (rout.from.id!==rin.from.id){
							var mc = this.layers['cvsMAIN'];
							var sLink = mc.getChildByName(link.id);
							sLink.bidirection = link.bidirection = true;
							//sLink.drawPerm(sLink,false);
							sLink.moveLink(sLink, wbFormProxy.UPDATE);
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
	

	setMainStage = function(mainStage){
		this.mainStage = mainStage;
    }
    
}
	// var p = extend(WBoard, Container);
	
	
	function addListeners (shape,owner){
		shape.addEventListener("CommitEvent", onCommit.bind(owner));
		//shape.addEventListener("NONCommitEvent", onNONCommit.bind(owner));
		shape.addEventListener("PressEvent", onPress.bind(owner));
		shape.addEventListener("ReleaseEvent", onRelease.bind(owner));
		if (shape.type!=="links")
			shape.on("pressmove", moveLocally.bind(owner));
	}
	
	/*function onNONCommit(event){
		
	}*/
	
	function moveLocally (evt){
		//console.log(evt);
		var shape = evt.currentTarget;
		if (this._tempModel.type==="links"){//You can't moveBy links... they Area tied down by binding objects
			return;
		}
		var newX=evt.stageX-shape.rel.x+shape.regX;
		var newY=evt.stageY-shape.rel.y+shape.regY;
		shape.x=newX;
		shape.y=newY;
		// var update=true;
		evt.stopImmediatePropagation();
		
	   var myevent = {
		 type: "MoveEvent",
		 param: shape
	   };
		shape.dispatchEvent(myevent);
		//console.log("..............");
	}
	function onCommit(event){
		Trace("=========commited-========"+this.currentTab);
		var shape = event.param;
		console.log({shape});
		
		if (shape.type==="links" && event.action!==wbFormProxy.DELETE){//check to see if another link with SAME objects exists  
			var isCopy=this.uniqueLink(shape,this.currentTab);
			if (isCopy){//remove shape from Stage since its a copy
				Trace("========= C O P Y ========");
				this.onDelete(shape,this.currentTab,false,true);//only delete locally fromJMS==true assumes server is up to Date.
				shape=isCopy;
			}
			shape.visible=true;
		}
		shape._commited=true;
		//this.shapeNOW.parent.removeChild(this.shapeNOW);
		
		this.updateShape(shape,event.action,this.currentTab);
		//Trace(event);	
	}
	
	function onPress(event){
		Trace("=========onPRESS-========"+this.currentTab);
		
		if (this.shapeNOW!=null)
			this.shapeNOW.visible=true;
		//this.resizer.wrapTarget(this.resizer,null);
		//console.log("now target link to this shape if this is the type tool currently in use");
		//console.log("skip the rest of the function if type == links");
		var shape = event.param;
		console.log("   ===>"+shape.id);
		if (this._tempModel.type==="links"){
			console.log("ola links just happened");
			var frshape = null;
			if (this.shapeNOW == null){
				frshape=shapeCreate(this);
				console.log("=========  ( A )");
			}else{
				if (this.shapeNOW.type==="links"){
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
				this.mainStage.removeEventListener("stagemousemove", this._pressMove);
				return;
			}
			this.shapeNOW=frshape;
			frshape.x=shape.x;
			frshape.y=shape.y;
			this.mainStage.addEventListener("stagemousemove", this._pressMove);
			return;
		}
        this.mainStage.addEventListener("stagemouseup", shape.moveEND.bind(shape));
		if (!shape.scaled){
            Tween.get(shape,{override:true}).to({scaleX:1.05, scaleY:1.05},100,
                // createjs.Ease.quadIn
            );
			shape.scaled=true;
			shape.rel2=new Point(this.mainStage.mouseX-shape.x,this.mainStage.mouseY-shape.y);
			shape.rel = new Point(shape.width*.5+shape.rel2.x,shape.height*.5+shape.rel2.y);
		}
	}
	/** ReleaseEvent is also selectevent**/
	function onRelease(event){
		Trace("=========onRelease-========"+this.currentTab);
		// debugger 
		var shape = event.param;
		if (this._tempModel.type==="links"){
			console.log("ola links just happened");
			return;
		}
        this.mainStage.removeEventListener("stagemousemove", shape.moveSTART);
        this.mainStage.removeEventListener("stagemouseup", shape.moveEND);
		

		Trace(this.resizer);
		Trace("=========onSelect-=22222=======");
		this.resizer.handleRollOver(event);
		if (!this.resizer.parent)
			this.addChild(this.resizer);
		this.resizer.wrapTarget(this.resizer,shape);
		console.log(shape);
		this.shapeNOW = shape
	}
	
	function shapeCreate(owner){
        var mainStage = owner.mainStage;
		console.log("!!!!! create    !!!"+owner._tempModel.classIn);
		var mc = owner.layers['cvsMAIN'];
		var type =owner._tempModel.type
		var nameIn="rcolvi_";
		if (!owner._isSynched){
			nameIn+=owner._int
			++owner._int;
		}
		var shape = new Forms["Form"+toTitleCase(owner._tempModel.classIn)](nameIn, type, mainStage)
		//var shape = new FormLine("rcolvi_"+type, type);
		shape.x=mainStage.mouseX;
		shape.y=mainStage.mouseY;
		shape.class=toTitleCase(owner._tempModel.classIn);
		mc.addChild(shape);
		owner.shapeNOW=shape;
		addListeners(shape,owner);	
		return shape;
	}


	
	EventDispatcher.initialize(WBoard.prototype);
	
	
    // scope.WBoard = createjs.promote(WBoard, "Container");
    
    export default  promote(WBoard, "Container"); 
