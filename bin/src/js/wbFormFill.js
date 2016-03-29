(function(scope) {
 'use strict';
	///var scope;// SAME AS static dynamic var
	function FormFill(id,type) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = "";
		this.type=type;
		this.limitDraw=false;
		this.rect=null;
		this.segSize=12;
		this.regX=0;
		this.regY=0;
		this.scaled=false;
		this.rel={x:0,y:0};   		//relative coordinates
		this.tempOrigin=null;
		this.lastXY={x:0,y:0}
		this.related=null;
		this.biderectional=false;
		this._commited = false;
		this.elastic=true;
		this.rotary=true;
		this.setup();
	}
	createjs.EventDispatcher.initialize(FormFill.prototype);
	var p = createjs.extend(FormFill, createjs.Container);

	p.setup = function() {
		this.points=[];
		//this.l
	this.bg = new createjs.Shape();
	this.hitHelper = new createjs.Shape();
	this.bg.hitArea=this.hitHelper;
	
		this.addChild(this.bg); 
		
		this.on("mousedown", this.handlePress.bind(this));
		this.on("pressup", this.handleRelease.bind(this));
		this.cursor = "pointer";
		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
		this.status=window.WBdraw.FormProxy.NEW;
	} ;

	p.drawTemp= function (fx,fy) {
		this._commited = false;
		this.uncache();
		p[this.type](this,fx,fy);
	}
	
	p.drawPerm= function (shape,init) {
		if (shape.id !=this.id)
			return;
		try{
			var finalIn=p[this.type+"Perm"](this,shape,init);
		}catch(err){
			//console.log(err);
			throw "[E] No function matches:"+this.type+"Perm() in FormFill (wbFormFill.js)";
			
		}
		 // console.log("...create....");
		if (finalIn)
			this.commit(window.WBdraw.FormProxy.UPDATE);
	}
	p.commit = function (action){
		   var myevent = {
			 type: "CommitEvent",
			 param: this,
			 action:action
		   };
		this.dispatchEvent(myevent);
	}


	
	p.scaleState = function (scld){
		this.scaled=scld;
		this.scaleX=this.scaleY=1;
	}
	p.setSize = function (width,height,color){
		
	}


	p.moveSTART = function (event){
		event.stopImmediatePropagation();
		var mStage = event.target;		
		var target, targets = mStage.getObjectsUnderPoint(mStage.mouseX, mStage.mouseY, 1);
        for (var i=0; i<targets.length; i++) {
            if (targets[i].parent.scaled) {
                target = targets[i].parent;
                break;
            }
        }

        if (target != null) {
			//target.x=mStage.mouseX-target.rel.x+target.regX;
			//target.y=mStage.mouseY-target.rel.y+target.regY;
			//console.log(target.rel+","+target.regX);
			//console.log(event);
			console.log("@@@  start 9 @@@@");
			//mainStage.update();
			//event.target.update();
		}
	}
	p.moveEND = function(event){
		var mStage = event.target;
		
		if (this.x==this.lastXY.x && this.y==this.lastXY.y){
			return;
		}
		var target, targets = mStage.getObjectsUnderPoint(mStage.mouseX, mStage.mouseY, 1);
        for (var i=0; i<targets.length; i++) {
            if (targets[i].parent.scaled) {
                target = targets[i].parent;
                break;
            }
        }
        if (target != null) {
			target.scaled=false;
		createjs.Tween.get(target,{override:true}).to({scaleX:1, scaleY:1},100,createjs.Ease.quadIn);
		}
		
		  //console.log("...moved....");
		this.commit(window.WBdraw.FormProxy.MOVED);
		this.lastXY.x=this.x;
		this.lastXY.y=this.y;
		//event.stopImmediatePropagation();
	}
	
	
	
	p.handlePress = function(event){
		  //console.log("...handlePress....");
	   var mevt = {
		 type: "PressEvent", 
		 param: this
	   };
		//if (!this.scaled)
		event.stopImmediatePropagation();
	   this.dispatchEvent(mevt);
	}
	
	p.handleRelease = function(event){
	   var mevt = {
		 type: "ReleaseEvent", 
		 param: this
	   };
		event.stopImmediatePropagation();
	   this.dispatchEvent(mevt);
	}
	


	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};

	
	p.square = function(owner,fx,fy){
		var lc=new createjs.Point(fx,fy);
		var MC =owner.bg.graphics;
		MC.clear();
		owner.points=[];
		MC.setStrokeStyle(5);
			MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.rect(0,0,lc.x, lc.y);
		owner.points.push(lc);
		MC.endStroke();
		MC.endFill(); 
		//this.cache(0,0,inX,inY);
	}
	
	

	p.squarePerm = function(owner,shape,init){
		
		var MC =owner.bg.graphics;
		var HTC =owner.bg.hitArea.graphics;
		MC.clear();
		HTC.clear();
		var tot = owner.points.length;
		if (tot==0){
			var parentIN= owner.parent;
			//console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			//console.log(parentIN.getNumChildren());
			return false;
		}
		olc = owner.points[0];
		lc = window.WBdraw.ConfigWB.convert2pos(owner,olc);
		var strokeIn=5;
		if (lc.x<0){//moveBy in the + direction X
			owner.regX=-Math.abs(lc.x*.5);
			owner.x=owner.x+owner.regX;
		}else{//moveBy in neg
			owner.regX = Math.abs(lc.x*.5);
			owner.x = owner.x+owner.regX;
		}
		if (lc.y<0){//moveBy in the + direction Y
			owner.regY =-Math.abs(lc.y*.5);
			owner.y = owner.y+owner.regY;
		}else{//moveBy in neg
			owner.regY=Math.abs(lc.y*.5);
			owner.y=owner.y+owner.regY;
		}
		var inX=Math.floor(lc.x);
		var inY=Math.floor(lc.y)
		owner.width=Math.abs(inX);
		owner.height=Math.abs(inY);
		if (owner.width<10 || owner.height<10){
			owner.parent.removeChild(owner);
			delete owner;
			return false;
		}
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.rect(0,0,inX,inY);
		MC.rect(0,0,inX,inY);
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		MC.endFill(); 
		//owner.cache(-strokeIn,-strokeIn,inX+strokeIn*2,inY+strokeIn*2);
		owner.cache(-strokeIn+(inX<0?inX:0),-strokeIn+(inY<0?inY:0), owner.width+strokeIn*2,owner.height+strokeIn*2);
		//owner.setBounds(owner.x,owner.y,owner.width+strokeIn*2,owner.height+strokeIn*2);
		
		return true;
	}

	
	p.circle = function(owner,fx,fy){
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
		
		var MC =owner.bg.graphics;
		MC.clear();
		owner.points=[];
		

		
		MC.setStrokeStyle(5);
			MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.drawEllipse(0,0,lc.x, lc.y);
		owner.points.push(lc);
		MC.endStroke();
		MC.endFill(); 
	}
	p.circlePerm = function(owner,shape,init){
		var MC =owner.bg.graphics;
		var HTC =owner.bg.hitArea.graphics;
		MC.clear();
		HTC.clear();
		var tot = owner.points.length;
		if (tot==0){
			var parentIN= owner.parent;
			//console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			//console.log(parentIN.getNumChildren());
			return false;
		}
		
		olc = owner.points[0];
		lc = window.WBdraw.ConfigWB.convert2pos(owner,olc);
		var strokeIn=5;
		if (lc.x<0){//moveBy in the + direction X
			owner.regX=-Math.abs(lc.x*.5);
			owner.x=owner.x+owner.regX;
		}else{//moveBy in neg
			owner.regX = Math.abs(lc.x*.5);
			owner.x = owner.x+owner.regX;
		}
		if (lc.y<0){//moveBy in the + direction Y
			owner.regY =-Math.abs(lc.y*.5);
			owner.y = owner.y+owner.regY;
		}else{//moveBy in neg
			owner.regY=Math.abs(lc.y*.5);
			owner.y=owner.y+owner.regY;
		}
		
		var inX=Math.floor(lc.x);
		var inY=Math.floor(lc.y)
		owner.width=Math.abs(inX);
		owner.height=Math.abs(inY);
		if (owner.width<10 || owner.height<10){
			owner.parent.removeChild(owner);
			delete owner;
			return false;
		}
		//owner.setBounds(owner.x,owner.y,Math.abs(inX),Math.abs(inY));
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.drawEllipse(0,0,inX,inY);
		MC.drawEllipse(0,0,inX,inY);
		
		//window.WBdraw.trace();
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		MC.endFill(); 
		
		owner.cache(-strokeIn+(inX<0?inX:0),-strokeIn+(inY<0?inY:0), owner.width+strokeIn*2,owner.height+strokeIn*2);
		return true;
	}
	
	p.star = function(owner,fx,fy){
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
		var sPos={};
		var MC =owner.bg.graphics;
		MC.clear();
		owner.points=[];
		MC.setStrokeStyle(5);
			MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
			console.log("---=-=-=--=-=-=-=-=>>>>")
			sPos.radius=200*(fx/mainStage.canvas.width);  //max radius based on X
			sPos.pointy=.9*(fy/mainStage.canvas.height);   // max Point size based on Y
			sPos.points=5;
			MC.drawPolyStar(0, 0, sPos.radius, sPos.points, sPos.pointy, -90);
			//MC.drawPolyStar(0, 0, 50, 5, 0.6, -90);
		owner.points.push(sPos);
		MC.endStroke();
		MC.endFill(); 
	}
	p.starPerm = function(owner,shape,init){
		var MC =owner.bg.graphics;
		var HTC =owner.bg.hitArea.graphics;
		MC.clear();
		HTC.clear();
		var tot = owner.points.length;
		if (tot==0){
			var parentIN= owner.parent;
			console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			console.log(parentIN.getNumChildren());
			return false;
		}
		sPos = owner.points[0];
		var strokeIn=5;
		
		owner.width=Math.abs(Math.floor(sPos.radius*2));
		owner.height=Math.abs(Math.floor(sPos.radius*2));
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.drawPolyStar(0, 0, sPos.radius, sPos.points, sPos.pointy, -90);
		MC.drawPolyStar(0, 0, sPos.radius, sPos.points, sPos.pointy, -90);
		
		owner.x-=sPos.radius;
		owner.y-=sPos.radius;
		this.x+=sPos.radius;
		this.y+=sPos.radius;
		/**/
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		MC.endFill(); 
		return true;
	}
	
	
	p.destroy = function(fromJMS){
		this.uncache();
		this._commited = false;
	}
	
	
	scope.FormFill = createjs.promote(FormFill, "Container");
}(window.WBdraw));