(function(scope) {
 'use strict';
	///var scope;// SAME AS static dynamic var
	function FormResize(id,type) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = "";
		this.type=type;
		this.limitDraw=false;
		this.rect=null;
		this.segSize=12;
		this.tolerance=10;
		this.regX=0;
		this.regY=0;
		this.scaled=false;
		this.rel=null;   		//relative coordinates
		this.formTarget=null;
		this.box1=null;
		this.box2=null;
		this.box3=null;
		this.box4=null;
		this.boxr=null;
		this.setup();
		console.log ("@@@@@@  NEW FormResize  ");
	}
	createjs.EventDispatcher.initialize(FormResize.prototype);
	var p = createjs.extend(FormResize, createjs.Container);
	
	function bx1_move(btn,btn_name){
		if (btn_name.indexOf("r")!=-1)
			btn.on("pressmove", moveitR.bind(this));  //btn.on("pressmove", moveitR.bind(this));
		else
			btn.on("pressmove", moveit.bind(this));
		return "";
	}	
	function bx1_stop(btn,btn_name){
			btn.off("pressmove");
			var pt= this.formTarget.globalToLocal(this.box4.x*2,this.box4.y*2);
			this.rotation=this.formTarget.rotation;
			switch(this.formTarget.type){
				case 'bezier':
					break;
				case 'free':
					break;
				default:
					this.formTarget.x=this.x-this.box4.x+this.tolerance;
					this.formTarget.y=this.y-this.box4.y+this.tolerance;
					this.formTarget.drawTemp((this.box4.x*2)-this.tolerance*2,(this.box4.y*2)-this.tolerance*2);
					this.formTarget.drawPerm(this.formTarget);
			}
		this.formTarget.commit("resize");
		return "";
	}
	
	function moveitR(event){
		var pt = this.globalToLocal(event.stageX,event.stageY);
		var angle=cAngle({x:0,y:0},pt);
		this.formTarget.rotation=angle+this.rotation;//this.rotation;
	}
	function moveit(event){
		console.log(event);
		var bx = event.currentTarget;
		var pt = this.globalToLocal(event.stageX,event.stageY);
		var oldX=0;
		var oldY=0;
		oldX=bx.x;
		oldY=bx.y;
		bx.x=pt.x;
		bx.y=pt.y;
		nX=Math.abs(pt.x);
		nY=Math.abs(pt.y);
		var midW=Math.ceil(nX*.5);
		var midH=Math.ceil(nY*.5);
		var rFail=false;
		
		var bs1 = this.box1.globalToLocal(event.stageX,event.stageY);
		var bs2= this.box2.globalToLocal(event.stageX,event.stageY);
		var bs3 = this.box3.globalToLocal(event.stageX,event.stageY);
		var bs4 = this.box4.globalToLocal(event.stageX,event.stageY);
		//if (midW<15 || midH<15){
		//	rFail=true;
		//}
		if (this.box1.hitTest(bs1.x,bs1.y) && bx.name!="bx1"){
			rFail=true;
		}else if(this.box2.hitTest(bs2.x,bs2.y) && bx.name!="bx2"){
			rFail=true;
		}else if(this.box3.hitTest(bs3.x,bs3.y) && bx.name!="bx3"){
			rFail=true;
		}else if(this.box4.hitTest(bs4.x,bs4.y) && bx.name!="bx4"){
			rFail=true;
		}
		
		
		
		
		
		// HIT TEST
		
		
		
		console.log("----->"+bs1.x+","+bs1.y);
		console.log("--$$#--->"+bx.x+","+bx.y);
		console.log("--$@!#$#--->"+this.box2.x+","+this.box2.y);
		
		console.log("_________________~~~##@@>>>>  "+rFail);
		
		
		
		if (rFail){
			bx.x=oldX;
			bx.y=oldY;
			return;
		}
		positionBoxes(this,midW*2,midH*2,bx)
		miniWrap(this.bg,Math.ceil(nX) ,Math.ceil(nY))
		//switch(bx.name){
			//case 'bx1':

		//console.log(this.formTarget);
	}
	
	p.setup = function() {
		this.points=[];
		//this.l
		this.bg = new createjs.Shape();
		this.box1= new WBdraw.resizeBtn("bx1", "#FFF",bx1_move.bind(this),bx1_stop.bind(this));
		this.box2=new WBdraw.resizeBtn("bx2", "#FFF",bx1_move.bind(this),bx1_stop.bind(this));
		this.box3=new WBdraw.resizeBtn("bx3", "#FFF",bx1_move.bind(this),bx1_stop.bind(this));
		this.box4=new WBdraw.resizeBtn("bx4", "#FFF",bx1_move.bind(this),bx1_stop.bind(this));
		this.boxr=new WBdraw.resizeBtn("bxr", "#FFF",bx1_move.bind(this),bx1_stop.bind(this));
		
	
		this.addChild(this.bg,this.box1,this.box2,this.box3,this.box4,this.boxr); 
		

		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;



	p.width=0;
	p.height=0;
	
	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};
	
		


	function cAngle(center, p1) {
		var p0 = {x: center.x, y: center.y - Math.sqrt(Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x)
				+ Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y))};
		return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x)) * 180 / Math.PI;
	}
	p.wrapTarget = function(owner,obj){
		if (obj==null){
			owner.formTarget=null;
			if (this.parent)
				this.parent.removeChild(this);
		}else{
			this.rotation=obj.rotation;
			console.log(obj);
			owner.formTarget=obj;
			var w=obj.width;
			var h=obj.height;
			var mc=this.bg.graphics;
			//console.log(w+",X"+h+",   x:"+obj.x+",Y:"+obj.y);
			owner.x=obj.x;
			owner.y=obj.y;
			var midW=Math.ceil(obj.width*.5)+this.tolerance;
			var midH=Math.ceil(obj.height*.5)+this.tolerance;
			positionBoxes(owner,midW,midH,"")
			miniWrap(this.bg,midW,midH);
		}
	}
	function positionBoxes(owner,midW,midH,bx){
		
		if (bx.name!="bx4"){
			owner.box4.x=midW;
			owner.box4.y=midH;
		}
		if (bx.name!="bx3"){
			owner.box3.x=0-midW;
			owner.box3.y=midH;
		}
		if (bx.name!="bx2"){
			owner.box2.x=midW;
			owner.box2.y=0-midH;
		}
		if (bx.name!="bx1"){
			owner.box1.x=0-midW;
			owner.box1.y=0-midH;
		}

		owner.boxr.x=0;
		owner.boxr.y=-60-midH;
	}
		
	function miniWrap(bg,midW,midH){
		var MC = bg.graphics;
		MC.clear();
		MC.beginStroke('red'); 
		MC.setStrokeStyle(2);
		var origin = new createjs.Point(-midW,-midH); 
		var midtp = new createjs.Point(0,0); 
		var tp= new createjs.Point(midW,-midH);
		var btm=new createjs.Point(midW,midH);
		var lft=new createjs.Point(-midW,midH);
		var rt=new createjs.Point(midW,midH);
		var rot=new createjs.Point(0,-60-midH);
		//MC.beginFill('red'); 
		createLineSegments(MC,origin,tp,false);   	//TOP
		createLineSegments(MC,origin,lft,true);		//LEFT
		createLineSegments(MC,lft,btm,false);		//BOTTOM
		createLineSegments(MC,tp,rt, true);			//RIGHT
		createLineSegments(MC,rot,midtp,true);		//ROTATION
	};
		
	
	function createLineSegments(MC,begin,end,isVert){
		var x1=dx1=begin.x;
		var x2=dx2=end.x;
		var y1=dy1=begin.y;
		var y2=dy2=end.y;
		d= Math.sqrt( (dx2-=dx1)*dx2 + (dy2-=dy1)*dy2 );

		tot =(d/12);
		var lastX=begin.x;
		var lastY=begin.y;
			//console.log("x:"+lastX+", y:"+lastY+" x2:"+x2+", y2:"+y2);
			console.log(lastY);
		var diff=d/tot;
		for (var i=0;i<=tot; ++i){
			if (isVert){
					y = Math.ceil(lastY+diff);
				var x=x2;
				if (y<lastY){
					lastY-=2;
				}else{
					lastY+=2;
				}
				if (y>Math.abs(y2))
					break;
			}else{
				x = Math.ceil(lastX+diff);
				var y=y2;
				if (x<lastX){
					lastX-=2;
				}else{
					lastX+=2;
				}
				if (Math.abs(x)>Math.abs(x2))
					break;
			}
			MC.moveTo(lastX,lastY); 
			MC.lineTo(x, y);
			lastX = x;
			lastY = y;
		}
	}
	
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
		return true;
	}

	
	

	scope.FormResize = createjs.promote(FormResize, "Container");
}(window.WBdraw));