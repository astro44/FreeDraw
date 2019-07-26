(function(scope) {
 // 'use strict';
	///var scope;// SAME AS static dynamic var
	function FormLine(id,type) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = "";
		this.type=type;
		this.class="Line";
		this.limitDraw=false;
		this.rect=null;
		this.segSize=12;
		this.regX=0;
		this.regY=0;
		this.scaled=false;
		this.rel={x:0,y:0};   		//relative coordinates
		this.text=null;
		this.label="";
		this.lastXY={x:0,y:0};
		this.cacheXY={x:0, y:0};
		this._commited = false; 
		this._listenMove=null;
		this._listenEnd=null;
		this.related=null;
		this.bidirection=false;
		this.elastic=true;
		this.rotary=true;
		this.setup();
	}
	createjs.EventDispatcher.initialize(FormLine.prototype);
	var p = createjs.extend(FormLine, createjs.Container);

	p.setup = function() {
		this.points=[];
		//this.l
	this.bg = new createjs.Shape();
	this.bg.snapToPixel=true;
	this.hitHelper = new createjs.Shape();
	this.hitHelper.snapToPixel=true;
	this.bg.hitArea=this.hitHelper;
	
		//this.sqr  = new createjs.Shape();
		//propLine(this.sqr,{x:45,y:45},'#000000');
		this.addChild(this.bg);//, this.sqr); 
		
		this.on("mousedown", this.handlePress.bind(this));
		this.on("pressup", this.handleRelease.bind(this));
		this.cursor = "pointer";
		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
		if (this.type=="links") drawArrow(this);
		this.status=window.WBdraw.FormProxy.NEW;
	} ;
	
	function drawArrow(owner){
		owner.rotary=false;
		owner.elastic=false;
		owner.arrow  = new createjs.Shape();
		owner.arrow.snapToPixel=true;
		owner.ball  = new createjs.Shape();
		owner.ball.snapToPixel=true;
		//owner.sqr  = new createjs.Shape();
		//owner.sqr2  = new createjs.Shape();
		propArrow(owner.arrow,20,'#000000');
		propBall(owner.ball,20,'#000000');
		//propSquare(owner.sqr,20,"#FF0000");
		owner.addChild(owner.arrow, owner.ball);//, owner.sqr2); 
	}
	
	/*function propLine(ball,size,color){
		var MC = ball.graphics;
		MC.clear();
		var hlf=-size*.5;
		MC.setStrokeStyle(5);
			MC.beginStroke(color); 
			MC.rect(0,0,size.x, size.y);
			//MC.beginFill(color); 
			//MC.drawEllipse(hlf,hlf,size,size);
		MC.endStroke();
	}*/
	
	/*function propSquare(ball,size,color){
		var MC = ball.graphics;
		MC.clear();
		var hlf=-size*.5;
		MC.setStrokeStyle(5);
			MC.beginStroke(color); 
			//MC.beginFill(color); 
			MC.drawEllipse(hlf,hlf,size,size);
		MC.endStroke();
	}
	
	function propSquare2(dd,size,pt,color){
		var MC = dd.graphics;
		//MC.clear();
		//console.log
		var hlf=-size*.5;
		MC.setStrokeStyle(5);
			MC.beginStroke(color); 
			 MC.setStrokeDash([20,10],3);
			 console.log(pt);
			MC.drawEllipse(pt.x,pt.y,size,size);
			//MC.mt(20,20);  // same as moveTo
			//MC.lineTo(260,20);
		MC.endStroke();
	}*/
	function propArrow(arrow,size, color){
		var MC = arrow.graphics;
		MC.clear();
		MC.setStrokeStyle(5);
			MC.beginStroke(color); 
			MC.beginFill(color); 
			MC.moveTo(-size,size);
			MC.lineTo(0,0);
			MC.lineTo(-size,-size);
		MC.endStroke();
		MC.endFill(); 
	}
	function propBall(ball,size, color){
		var MC = ball.graphics;
		MC.clear();
		var hlf=-size*.5;
		MC.setStrokeStyle(5);
			MC.beginStroke(color); 
			MC.beginFill(color); 
			MC.drawEllipse(hlf,hlf,size,size);
		MC.endStroke();
		MC.endFill(); 
	}
	function positionEnds(owner,from,to){
		var angle=window.WBdraw.ConfigWB.rotateAngle(from,to);
		console.log(angle);
		owner.arrow.rotation=angle;
		owner.ball.rotation=180+angle;
		owner.ball.x=0;
		owner.ball.y=0;
		owner.arrow.x=to.x-from.x;
		owner.arrow.y=to.y-from.y;
	}

	p.drawTemp= function (fx,fy) {
		this._commited = false;
		//console.log("drawtemp__"+this.type+"__");
		p[this.type](this,fx,fy);
	}
	p.linked = function(){
		console.log(this.related);
		return (this.related!=null? (this.related.from!=null):false)
	}
	p.link = function (shape){
			var Obj={from:null,to:null}
			if (this.related!=null){
				Obj=this.related;	
				if (Obj.from==shape){
					console.log("[E]  -->SAME shape AS to");
					return false;
				}
				if (Obj.to!=null && Obj.from!=null)//Avoid multiple sets 
					return true;
				Obj.to=shape;
				console.log(Obj);
				listenersAdd(this,Obj.to,Obj.from);
				finalIn = this.linksPerm(this,Obj.to,Obj.from,this.bidirection);
				
				if (finalIn)
					this.commit(window.WBdraw.FormProxy.UPDATE);
							
							return true;
				//TODO: draw final And commit
			}else{
				Obj.from=shape;
				this.related=Obj;
			}
		return false;
	}
	
	function listenersAdd(owner,to, from) {
			//console.log("(CNT) @@@@@@@@@@   ADD LISTENERS");
			owner._listenMove=moveForm.bind(owner);
			owner._listenEnd=moveCompleted.bind(owner);
			if (!BrowserDetect.isIOS()){
				if (BrowserDetect.isChrome()){ 
					to.addEventListener("MoveEvent",owner._listenMove);
					from.addEventListener("MoveEvent", owner._listenMove);
			}}
			to.addEventListener("CommitEvent", owner._listenEnd);
			from.addEventListener("CommitEvent", owner._listenEnd);
		}	
	function listenersRemove(owner,to, from) {
			//console.log("(CNT)  $$$$$$$$$$$$  REMOVE LISTENERS");
			if (to){
				if (!BrowserDetect.isIOS()){
					if (BrowserDetect.isChrome()){ 
					to.removeEventListener("MoveEvent", owner._listenMove);
				}}
				to.removeEventListener("CommitEvent", owner._listenEnd);
			}
			if (!BrowserDetect.isIOS()){
				if (BrowserDetect.isChrome()){ 
				from.removeEventListener("MoveEvent", owner._listenMove);
			}}
			from.removeEventListener("CommitEvent", owner._listenEnd);
	}
	
	function moveForm(event){
		//console.log("(CNT) [[moveForm]] LISTENERS"+this);
		console.log(event);
		this.moveLink(this, window.WBdraw.FormProxy.UPDATE);
	}

	function moveCompleted(event){
			//console.log("(CNT) [[moveCompleted]] LISTENERS"+this);
			if (event.action==window.WBdraw.FormProxy.DELETE){
				this._commited=false;
				this.commit(event.action);
				if (this.parent)
					this.parent.removeChild(this);
				this.destroy(false);
			}else{
				this.moveLink(this,window.WBdraw.FormProxy.UPDATE);	
			}
			
		//positionEnds(this,this.related.from, this.related.to);
		console.log(event);
	}
	
	function pointOnLine2(from,to,x){
		var m = (from.y-to.y)/(from.x-to.x);
		var c = from.y-from.x*m;
		var y = m*x+c;
		return y 
	}	
	function pointOnLine(from,to,x){
		var ax=to.x-from.x;   
		var ay=to.y-from.y;
		var nz={x:0,y:0};
		var m = (nz.y-ay)/(nz.x-ax);
		return x*m; 
	}

	
	p.moveLink = function (owner,action){
		var a =  owner.related.to;
		var b =  owner.related.from;
		owner.x= b.x;
		owner.y=b.y;
		
			
			owner.points=[];
			owner.points.push(new createjs.Point(a.x-b.x,a.y-b.y));
			owner.linksPerm(owner,false);
			//moveBy arrow And ball accordingly
		if (action!=null){//now find hit points to correctly resize the line between the objects
			
			owner.commit(action);
		}
		//positionEnds(owner,owner.related.from, owner.related.to);
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
		 
		if (finalIn)
			this.commit(window.WBdraw.FormProxy.UPDATE);
	}

	p.EMPTY = function (){
		return false;
	}
	p.commit = function (action){
		if (action=="blur")
			return;
		   var myevent = {
			 type: "CommitEvent",
			 param: this,
			 action:action
		   };
		this.dispatchEvent(myevent);
	}
	
	p.width=0;
	p.height=0;
	
	p.scaleState = function (scld){
		this.scaled=scld;
		this.scaleX=this.scaleY=1;
	}
	p.setSize = function (width,height,color){
		
	}
	p.getWidth = function(){
		return width;
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
			//console.log(target.rel+","+target.regX);
			//mainStage.update();
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
		 // console.log("...moved....");
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

	
	
	p.straight =  function (owner,fx,fy){
		
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
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
		//console.log(tot);
		//console.log(">>>>>>>>>>>>> what???>>>>>>>"+owner.points);
		if (tot==0){
			var parentIN= owner.parent;
			//console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			//console.log(parentIN.getNumChildren());
			return false;
		}
		olc = owner.points[0];
		lc = window.WBdraw.ConfigWB.convert2pos(owner,olc);
		var oc={x:0,y:0};
		//this now means that 
		if (lc.x<0){//moveBy in the + direction X
			owner.regX=Math.abs(lc.x)*.5;
			owner.bg.x=Math.abs(lc.x);
			owner.x=owner.x-owner.bg.x;
		}else{//moveBy in neg
			owner.regX = Math.abs(lc.x*.5);
		}
		owner.x = owner.x+owner.regX;
		
		if (lc.y<0){//moveBy in the + direction Y
			owner.regY =Math.abs(lc.y)*.5;
			owner.bg.y=Math.abs(lc.y);
			owner.y=owner.y-owner.bg.y;
		}else{//moveBy in neg
			owner.regY=Math.abs(lc.y*.5);
		}
		owner.y=owner.y+owner.regY;
		
		var inX=Math.floor(lc.x);
		var inY=Math.floor(lc.y)
		var strokeIn=5;
		MC.setStrokeStyle(strokeIn); 
		owner.color='#'+Math.floor(Math.random()*16777215).toString(16);
		MC.beginStroke(owner.color);
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.moveTo(0,0);
        MC.moveTo(0,0);
		MC.lineTo(lc.x, lc.y);
		HTC.lineTo(lc.x, lc.y);
		
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		
		owner.setDimension(owner,lc.x,lc.y,(inX<0?inX:0),(inY<0?inY:0));
		
		//owner.cache(-strokeIn+owner.bg.x*1,-strokeIn+owner.bg.y*1, (owner.bg.x>0?-1:1)*(owner.width+strokeIn*2),(owner.bg.y>0?-1:1)*(owner.height+strokeIn*2));
		//owner.cache((owner.bg.x>0?-1:1)*-strokeIn+(inX<0?inX:0),(owner.bg.y>0?-1:1)*-strokeIn+(inY<0?inY:0), (owner.bg.x>0?-1:1)*(owner.width+strokeIn*2),(owner.bg.y>0?-1:1)*(owner.height+strokeIn*2));
		//console.log(propLine);
		//owner.sqr.x=owner.bg.x;
		//owner.sqr.y=owner.bg.y;
		//propLine(owner.sqr, {x:owner.width, y:owner.height}, "#0000FF");
		
		owner.cache(-strokeIn,-strokeIn, owner.width+strokeIn*2,owner.height+strokeIn*2);
		
		//owner.cache(-strokeIn-owner.bg.x,-strokeIn-owner.bg.y, (owner.bg.x>0?-1:1)*owner.width+strokeIn*2, (owner.bg.y>0?-1:1)*owner.height+strokeIn*2);
		//owner.cache(-strokeIn+(owner.bg.x>0?-1:1)*owner.cacheXY.x,-strokeIn+(owner.bg.y>0?-1:1)*owner.cacheXY.y, (owner.bg.x>0?-1:1)*owner.width+strokeIn*2, (owner.bg.y>0?-1:1)*owner.height+strokeIn*2);
		//owner.cache(-strokeIn+(inX<0?inX:0),-strokeIn+(inY<0?inY:0), -owner.width+strokeIn*2,-owner.height+strokeIn*2);
		return true;
	}
	
	p.free = function(owner,fx,fy){
		
		var MC =owner.bg.graphics;
		var lp = owner.points[owner.points.length-1]; 
		var d=0;
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
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
		//console.log(owner);
		var tot = owner.points.length;
		if (tot==0){
			var parentIN= owner.parent;
			//console.log(parentIN.getNumChildren());
			owner.parent.removeChild(this);
			//console.log(parentIN.getNumChildren());
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
		var maxY=0;
		var maxX=0;
		var lowX=0;
		var lowY=0;
		var negX=0;
		var negY=0;
		for (var i=0;i<tot;++i){
			var cp=owner.points[i];
			if (cp.x>maxX) maxX=cp.x;
			if (cp.y>maxY) maxY=cp.y;
			if (cp.x<lowX) lowX=cp.x;
			if (cp.y<lowY) lowY=cp.y;
		}
       // HTC.moveTo(0, 0);
       // MC.moveTo(0, 0);
		if (lowX<0){negX=lowX; }
		if (lowY<0){negY=lowY}
		for (var i=0;i<tot;++i){
			owner.points[i].x+=Math.abs(negX);
			owner.points[i].y+=Math.abs(negY);
			var cp=owner.points[i];
			if (i==0){
				HTC.moveTo(cp.x,cp.y);
				MC.moveTo(cp.x,cp.y);
			}
			MC.lineTo(cp.x,cp.y);
			HTC.lineTo(cp.x,cp.y);
			//var d = Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
		}
		//(lowX,lowY)(addx,addx)
		/*owner.bg.x=(lowX<0?Math.abs(lowX):0);
		owner.bg.y=(lowY>0?Math.abs(lowY):0);
		*/
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		owner.x+=negX;
		owner.y+=negY;
		owner.rect= new createjs.Rectangle(0,0,Math.abs(negX)+maxX,Math.abs(negY)+maxY);
		var xMid = owner.rect.width*.5;
		var yMid =  owner.rect.height*.5;
		owner.x-=xMid;
		owner.y-=yMid;
		
		//owner.bg.hitArea.x=owner.bg.x;
		//owner.bg.hitArea.y=owner.bg.y;

			owner.regX=xMid;
			owner.x+=xMid*2;
			owner.regY=yMid;
			owner.y+=yMid*2;
		owner.setDimension(owner,owner.rect.width,owner.rect.height);
		console.log(owner.points);
		//owner.cache(-strokeIn+(inX<0?inX:0),-strokeIn+(inY<0?inY:0), owner.width+strokeIn*2,owner.height+strokeIn*2);
		owner.cache(-strokeIn,-strokeIn,owner.rect.width+strokeIn*2, owner.rect.height+strokeIn*2);
		return true;
	};

	p.bezier = function(owner,fx,fy){
		var sPos={};
		var pos={};
		sPos.x=0;
		sPos.y=0;
		var MC =owner.bg.graphics;
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
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
	p.bezierPerm = function (owner,shape,init){//http://blog.sklambert.com/finding-the-control-points-of-a-bezier-curve/
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
		//TODO:  set Bezier in positive space and use CACHE
		//owner.cache(-strokeIn+(inX<0?inX:0),-strokeIn+(inY<0?inY:0), owner.width+strokeIn*2,owner.height+strokeIn*2);
		//owner.cache(-strokeIn,-strokeIn,sPos.cx+strokeIn*2, sPos.fy+strokeIn*2);
		return true;
	}
	//connector
	p.links = function(owner,fx,fy){		
		var lc=new createjs.Point(fx,fy);
		//var lc= owner.bg.globalToLocal(fx,fy);
		var MC =owner.bg.graphics;
		MC.clear();
		console.log("     >>> >> >     connector connecting");
		owner.points=[];
		MC.setStrokeStyle(5);
		d= Math.sqrt( (lc.x)*lc.x + (lc.y)*lc.y );
		r = d%owner.segSize;
		var lastX=0;
		var lastY=0;
		var rX=(lc.x>0?-1:1)*10;
		var rY=(lc.y>0?-1:1)*10;
		tot =(d/owner.segSize);
		for (var i=0;i<tot; ++i){
			var x=lc.x*(i/tot)+rX;	
			var y=lc.y*(i/tot)+rY;	
			MC.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16)); 
			MC.moveTo(lastX,lastY); 
			MC.lineTo(x, y);
			lastX = x;
			lastY = y;
		}
		MC.moveTo(lastX+rX,lastY+rY); 
		MC.lineTo(lc.x+rX, lc.y+rY);
		owner.points.push(lc);
		MC.endStroke();
	    positionEnds(owner,{x:0,y:0}, {x:lc.x+rX, y:lc.y+rY});
	}	
	
	function linkFinal(owner,shape,sych){
		var MC =owner.bg.graphics;
		var HTC =owner.bg.hitArea.graphics;
		MC.clear();
		HTC.clear();
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
		
		var inX=Math.floor(lc.x);
		var inY=Math.floor(lc.y)
		var strokeIn=5;
		if (sych!=true){
			MC.setStrokeStyle(strokeIn); 
			owner.color='#'+Math.floor(Math.random()*16777215).toString(16);
			MC.beginStroke(owner.color);
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
		owner.setDimension(owner,lc.x,lc.y,(inX<0?inX:0),(inY<0?inY:0));
		}
	}
	
	p.linksPerm = function(owner,init){
		
		var strokeIn=5;
		var to=owner.related.to;
		var from=owner.related.from;
		
		
		//positionEnds(owner,from, to);
		owner.points=[];
		positionEnds(owner,from, to);
		owner.points.push({x:owner.arrow.x , y: owner.arrow.y});
		linkFinal(owner,owner,true);
		
		
		// ## START SEARCH FOR TOUCH POINTS  ##//
		var gaps=6;
		 var zz=window.WBdraw.ConfigWB.lineInterpolate(owner, to.x-from.x , to.y-from.y , gaps);
		 owner.related.a = zz;
		var a = (owner.related.a?owner.related.a:[]);
		//var mc = owner.sqr2.graphics;
		//this.sqr2.x=owner.sqr2.y=0;
		
		if (a.length>0)
			var mpt = {x:a[a.length-1].x*.5,y:a[a.length-1].y*.5}
		// mc.clear();
		 var tor={x:0,y:0,d:10000000};
		 var fromr={x:0,y:0,d:10000000};
		 for (var i=0;i<a.length;++i){
			var gx=a[i].x;
			var gy=a[i].y;
			
			var pt = owner.bg.localToLocal(gx,gy,to.bg);
			var ptb = owner.bg.localToLocal(gx,gy,from.bg); 
			if(to.bg.hitTest(pt.x,pt.y)){//find smallest distance from MID point  (increasing or decreasing?)
				var d = Math.sqrt( (mpt.x-gx)*(mpt.x-gx) + (mpt.y-gy)*(mpt.y-gy) );
				if (d<tor.d){
					tor.x=gx;
					tor.y=gy;
					tor.d=d;
				}
			}
			if(from.bg.hitTest(ptb.x,ptb.y)){//find smallest distance from MID point  (increasing or decreasing?)
				var d2 = Math.sqrt( (mpt.x-gx)*(mpt.x-gx) + (mpt.y-gy)*(mpt.y-gy) );
				if (d2<fromr.d){
					fromr.x=gx;
					fromr.y=gy;
					fromr.d=d2;
				}
			}
		 }
		// ## END SEARCH FOR TOUCH POINTS  ##//
		
		// propSquare2(owner.sqr2,20,{x:tor.x,y:tor.y},"#0000FF");
		 //propSquare2(owner.sqr2,20,{x:fromr.x,y:fromr.y},"#0000FF");
		 var ddpt2=owner.bg.localToLocal(tor.x,tor.y,owner.parent);
		 var ddpt=owner.bg.localToLocal(fromr.x,fromr.y,owner.parent);
		
		
		positionEnds(owner,fromr, tor);
		//positionEnds(owner,from, to);
		owner.points=[];
		owner.points.push({x:owner.arrow.x , y: owner.arrow.y});
		
		owner.x=ddpt.x;
		owner.y=ddpt.y;
		linkFinal(owner,owner,false);
		
		propArrow(owner.arrow,20,owner.color);
		if (owner.bidirection){
			propArrow(owner.ball,20,owner.color);
		}else{
			propBall(owner.ball,20,owner.color);
		}
		
		owner.uncache();
		//var chX=(owner.arrow.x<owner.ball.x?owner.arrow.x:owner.ball.x);
		//var chY=(owner.arrow.y<owner.ball.y?owner.arrow.y:owner.ball.y);
		
		
		owner.cache(-strokeIn+owner.cacheXY.x-10,-strokeIn+owner.cacheXY.y-10, owner.width+strokeIn*2+20,owner.height+strokeIn*2+20);
		
		return true;
	}
	


	
	p.setDimension = function (owner,w,h,cx,cy){
		owner.width=Math.abs(w);
		owner.height =Math.abs(h);
		owner.cacheXY={x:cx,y:cy};
		console.log(owner.width+"x"+owner.height);
	}

	p.destroy = function(fromJMS){
		this.uncache();
		this._commited = false;
		if (this.type=="links")
			listenersRemove(this,this.related.to,this.related.from);
			
		console.log(" delete link in FormLine................................");
		
	}
	

	scope.FormLine = createjs.promote(FormLine, "Container");
}(window.WBdraw));