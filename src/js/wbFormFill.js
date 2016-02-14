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
		this.rel=null;   		//relative coordinates
		this.setup();
		this.tempOrigin=null;
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
		
		this.on("mousedown", this.handlePress);
		this.on("pressup", this.handleRelease);
		this.on("pressmove", this.moveLocally);
		this.cursor = "pointer";
		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;

	p.drawTemp= function (fx,fy) {
		this.uncache();
		p[this.type](this,fx,fy);
	}
	
	p.drawPerm= function (shape,init) {
		if (shape.id !=this.id)
			return;
		try{
			var finalIn=p[this.type+"Perm"](this,shape,init);
		}catch(err){
			console.log(err);
			throw "[E] No function matches:"+this.type+"Perm() in FormLine (wbFormLine.js)";
			
		}
		  // var myevent = {
			// type: "CommitEvent",
			// param: this
		  // };
		if (finalIn)
			this.commit("create");
			//this.dispatchEvent(myevent);
	}
	p.commit = function (action){
		   var myevent = {
			 type: "CommitEvent",
			 param: this
		   };
		this.dispatchEvent(myevent);
	}

	p.width=0;
	p.height=0;
	
	p.setSize = function (width,height,color){
		
	}
	p.getWidth = function(){
		return width;
	}
	p.moveLocally = function(evt){
			var newX=evt.stageX-this.rel.x+this.regX;
			var newY=evt.stageY-this.rel.y+this.regY;

		this.x=newX;
		this.y=newY;
		update=true;
		evt.stopImmediatePropagation();
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
			console.log(target.rel+","+target.regX);
			console.log(event);
			console.log("@@@  start 9 @@@@");
			//mainStage.update();
			//event.target.update();
		}
	}
	p.moveEND = function(event){
		var mStage = event.target;
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
		//event.stopImmediatePropagation();
	}
	
	
	
	p.handlePress = function(event){
       // mainStage.addEventListener("stagemousemove", this.moveSTART);
        mainStage.addEventListener("stagemouseup", this.moveEND);
		if (!this.scaled){
		createjs.Tween.get(this,{override:true}).to({scaleX:1.05, scaleY:1.05},100,createjs.Ease.quadIn);
		this.scaled=true;
		
		//this.rel=this.globalToLocal(mainStage.mouseX,mainStage.mouseY);
		this.rel2=new createjs.Point(mainStage.mouseX-this.x,mainStage.mouseY-this.y);
		//this.regStage = this.localToGlobal(this.regX,this.regY);
		
			
			this.rel = new createjs.Point(this.width*.5+this.rel2.x,this.height*.5+this.rel2.y);
		//this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		event.stopImmediatePropagation();
		}
	}
	
	
	
	
	p.handleRelease = function(event){
        mainStage.removeEventListener("stagemousemove", this.moveSTART);
        mainStage.removeEventListener("stagemouseup", this.moveEND);
		event.stopImmediatePropagation();
		//this.skewX = -35;
		//this.rotation= 35;
		//this.rotation+= 35;
		
	   var mevt = {
		 type: "SelectEvent",
		 param: this
	   };
	   this.dispatchEvent(mevt);
	}
	


	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};

	
	p.square = function(owner,fx,fy){
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
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
			console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			console.log(parentIN.getNumChildren());
			return false;
		}
		lc = owner.points[0];
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
		owner.cache(-strokeIn,-strokeIn,inX+strokeIn*2,inY+strokeIn*2);
		
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
			console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			console.log(parentIN.getNumChildren());
			return false;
		}
		lc = owner.points[0];
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
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		MC.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)); 
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.drawEllipse(0,0,inX,inY);
		MC.drawEllipse(0,0,inX,inY);
		
		window.WBdraw.trace();
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		MC.endFill(); 
		owner.cache(-strokeIn,-strokeIn,inX+strokeIn*2,inY+strokeIn*2);
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
	scope.FormFill = createjs.promote(FormFill, "Container");
}(window.WBdraw));