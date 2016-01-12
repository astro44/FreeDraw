(function(scope) {
 'use strict';
	///var scope;// SAME AS static dynamic var
	function FormLine(id,type) {
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
	}
	createjs.EventDispatcher.initialize(FormLine.prototype);
	var p = createjs.extend(FormLine, createjs.Container);

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
		   var myevent = {
			 type: "CommitEvent",
			 param: this
		   };
		if (finalIn)
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
		//Below is only needed to keep object in play
		this.x=evt.stageX-this.rel.x+this.regX;
		this.y=evt.stageY-this.rel.y+this.regY;
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
			target.x=mStage.mouseX-target.rel.x+target.regX;
			target.y=mStage.mouseY-target.rel.y+target.regY;
			console.log(target.rel+","+target.regX);
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
        mainStage.addEventListener("stagemousemove", this.moveSTART);
        mainStage.addEventListener("stagemouseup", this.moveEND);
		if (!this.scaled){
		createjs.Tween.get(this,{override:true}).to({scaleX:1.05, scaleY:1.05},100,createjs.Ease.quadIn);
		this.scaled=true
		this.rel=this.globalToLocal(mainStage.mouseX,mainStage.mouseY);
		
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
		//console.log("handleRelease");
	   var mevt = {
		 type: "SelectEvent",
		 param: this
	   };
	   this.dispatchEvent(mevt);
	}
	


	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};
	p.straight =  function (owner,fx,fy){
		var lc= owner.bg.globalToLocal(fx,fy);
		
		var MC =owner.bg.graphics;
		MC.clear();
		owner.points=[];
		MC.setStrokeStyle(5);
		d= Math.sqrt( (lc.x)*lc.x + (lc.y)*lc.y );
		r = d%owner.segSize;
		tot =d/owner.segSize;
		var lastX=0;
		var lastY=0;
		for (var i=0;i<tot; ++i){
			var x=lc.x*(i/tot);	
			var y=lc.y*(i/tot);	
			MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.moveTo(lastX,lastY); 
			MC.lineTo(x, y);
			lastX = x;
			lastY = y;
		}
		MC.moveTo(lastX,lastY); 
		MC.lineTo(lc.x, lc.y);
		owner.points.push(lc);
		MC.endStroke();
		
	}
	p.straightPerm = function(owner,shape,init){
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
		if (lc.x<0){//moveBy in the + direction X
			owner.regX=-Math.abs(lc.x*.5);
		}else{//moveBy in neg
			owner.regX = Math.abs(lc.x*.5);
		}
		owner.x = owner.x+owner.regX;
		
		if (lc.y<0){//moveBy in the + direction Y
			owner.regY =-Math.abs(lc.y*.5);
		}else{//moveBy in neg
			owner.regY=Math.abs(lc.y*.5);
		}
		owner.y=owner.y+owner.regY;
		
		var strokeIn=5;
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.moveTo(0, 0);
        MC.moveTo(0, 0);
		MC.lineTo(lc.x, lc.y);
		HTC.lineTo(lc.x, lc.y);
		
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		
		owner.setDimension(owner,lc.x,lc.y);
		return true;
	}
	
	p.free = function(owner,fx,fy){
		
		var MC =owner.bg.graphics;
		var lp = owner.points[owner.points.length-1]; 
		var d=0;
		var lc= owner.bg.globalToLocal(fx,fy);
		//console.log(fx+","+fy);
		//console.log(lc);
		MC.setStrokeStyle(5);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		if (lp==undefined)
			lp = new createjs.Point(0,0);
		var x1=lc.x;
		var y1=lc.y;
		var x2=lp.x;
		var y2=lp.y;
		d =  Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
		if (d>owner.segSize){
			MC.moveTo(lp.x, lp.y);
			MC.lineTo(lc.x, lc.y);
			MC.endStroke();
			owner.points.push(lc);
		}
		//console.log(d);
	};	
	p.freePerm = function (owner,shape,init){
		var MC =owner.bg.graphics;
		var HTC =owner.bg.hitArea.graphics;
		console.log(owner);
		var tot = owner.points.length;
		if (tot==0){
			var parentIN= owner.parent;
			console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			console.log(parentIN.getNumChildren());
			return false;
		}
		var lp = new createjs.Point(0,0); 
		MC.clear();
		var strokeIn=5;
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));  
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.moveTo(0, 0);
        MC.moveTo(0, 0);
		var maxY=0;
		var maxX=0;
		var lowX=0;
		var lowY=0;
		for (var i=0;i<tot;++i){
			var cp=owner.points[i];
			MC.lineTo(cp.x,cp.y);
			HTC.lineTo(cp.x,cp.y);
			if (cp.x>maxX) maxX=cp.x;
			if (cp.y>maxY) maxY=cp.y;
			if (cp.x<lowX) lowX=cp.x;
			if (cp.y<lowY) lowY=cp.y;
			//var d = Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
		}
		//(lowX,lowY)(addx,addx)
		/*owner.bg.x=(lowX<0?Math.abs(lowX):0);
		owner.bg.y=(lowY>0?Math.abs(lowY):0);
		*/
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		owner.x-=owner.bg.x;
		owner.y+=owner.bg.y;
		owner.rect= new createjs.Rectangle(0,0,maxX,maxY);
		/*owner.regX = maxX*.5;
		owner.regY = maxY*.5;
		owner.x+=owner.regX;
		owner.y+=owner.regY;
		*/
		
		var xMid = lowX+Math.abs((lowX-maxX)*.5)
		var yMid = lowY+Math.abs((lowY-maxY)*.5)
		//owner.bg.hitArea.x=owner.bg.x;
		//owner.bg.hitArea.y=owner.bg.y;
		if (lowX<0){//moveBy in the + direction X
			owner.regX=-Math.abs(xMid);
		}else{//moveBy in neg
			owner.regX = Math.abs(xMid);
		}
		owner.x = owner.x+owner.regX;
		if (lowY<0){//moveBy in the + direction Y
			owner.regY =-Math.abs(yMid);
		}else{//moveBy in neg
			owner.regY=Math.abs(yMid);
		}
			owner.y=owner.y+owner.regY;
		owner.setDimension(owner,owner.rect.width,owner.rect.height);
		return true;
	};

	p.bezier = function(owner,fx,fy){
		var sPos={};
		var pos={};
		sPos.x=0;
		sPos.y=0;
		var MC =owner.bg.graphics;
		var lc= owner.bg.globalToLocal(fx,fy);
		MC.clear();
		owner.points=[];
		MC.setStrokeStyle(5);
		
		var Xing=Math.round(lc.x);
		var Ying=Math.round(lc.y);
		sPos.fx=pos.fx=Xing;
		sPos.cx=pos.cx=sPos.fx;
		sPos.fy=pos.fy=Ying;
		sPos.cy=pos.cy=sPos.y;
		
			MC.setStrokeStyle(1);
			MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.moveTo(sPos.fx, sPos.fy);
			MC.lineTo(sPos.cx, sPos.cy);
			MC.lineTo(sPos.x, sPos.y);
			MC.setStrokeStyle(5);
			MC.bezierCurveTo(sPos.fx, sPos.fy,sPos.cx, sPos.cy,sPos.x,sPos.y);
		owner.points.push(sPos);
		MC.endStroke();
		//owner.height =sPos.fy;
		//owner.width=sPos.cx
		//console.log(owner.width+"x"+owner.height);
	};	
	p.bezierPerm = function (owner,shape,init){
		var tot = owner.points.length;
		var strokeIn=5;
		var MC =owner.bg.graphics;
		var HTC =owner.bg.hitArea.graphics;
		MC.clear();
		HTC.clear();
		if (tot==0){
			var parentIN= owner.parent;
			console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			console.log(parentIN.getNumChildren());
			return false;
		}
		var sPos=owner.points[0];
		HTC.setStrokeStyle(strokeIn*5);
		HTC.beginStroke('#000'); 
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
		MC.bezierCurveTo(sPos.fx, sPos.fy,sPos.cx, sPos.cy,sPos.x,sPos.y);
		HTC.bezierCurveTo(sPos.fx, sPos.fy,sPos.cx, sPos.cy,sPos.x,sPos.y);
        MC.endStroke();
        HTC.endStroke();
		owner.setDimension(owner,sPos.cx,sPos.fy);
		return true;
	}
	
	p.connector = function(owner,fx,fy){
		
	}	
	p.connectorPerm = function(owner,fx,fy){
		
	}
	p.connectorFollowEdge = function(owner,toObj,fromObj){
		//get all points on a line And find the intercept 
		var line=owner;
		point=new createjs.Point(toObj.x+(toObj.width*.5),toObj.y+(toObj.height*.5));
		target=new createjs.Point(fromObj.x+(fromObj.width*.5),fromObj.y+(fromObj.height*.5));
		var maxX=point.x -target.x;
		var maxY=point.y-target.y;
		var total=maxY;
		if (maxX>maxY){//checkError all points based on x coordinates
			total=maxX;
		}
		var angle = Math.atan2(target.Y - point.Y, target.X - point.X);
		var moveby = 2;
		
		var context = canvas.getContext("2d");
		for (var i=0;i<total;++i){
			//loop through each pixel to find color different
			//use slope And http://stackoverflow.com/questions/13491676/get-all-pixel-coordinates-between-2-points
			
			var addY = Math.sin(angle) * moveby;
			var addX = Math.cos(angle) * moveby;
			var newPoint= new createjs.Point(fromObj.x+addX,fromObj.y+addY);
			var  imgData = context.getImageData(newPoint.x, newPoint.y, 2, 2).data;
			var color = "rgba(" + imgData[pos] + "," + imgData[pos+1] + "," + imgData[pos+2] + "," + imgData[pos+3] + ")";
			if (color == "#CCCCCC"){
				console.log("pixel found::"+color);
			}
				console.log(" found::"+color);
		}
	}
	

	
	p.setDimension = function (owner,w,h){
		owner.width=Math.abs(w);
		owner.height =Math.abs(h);
		console.log(owner.width+"x"+owner.height);
	}

	
	

	scope.FormLine = createjs.promote(FormLine, "Container");
}(window.WBdraw));