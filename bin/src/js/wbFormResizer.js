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
	}
	createjs.EventDispatcher.initialize(FormResize.prototype);
	var p = createjs.extend(FormResize, createjs.Container);
	
	function bx1_move(btn,btn_name){
		return "";
	}
	p.setup = function() {
		this.points=[];
		//this.l
		this.bg = new createjs.Shape();
		this.box1= new WBdraw.resizeBtn("bx1", "#FFF",bx1_move);
		this.box2=new WBdraw.resizeBtn("bx2", "#FFF",bx1_move);
		this.box3=new WBdraw.resizeBtn("bx3", "#FFF",bx1_move);
		this.box4=new WBdraw.resizeBtn("bx4", "#FFF",bx1_move);
		this.boxr=new WBdraw.resizeBtn("bxr", "#FFF",bx1_move);
		
	
		this.addChild(this.bg,this.box1,this.box2,this.box3,this.box4,this.boxr); 
		
		//this.on("mousedown", this.handlePress);
		//this.on("pressup", this.handleRelease);
		//this.on("pressmove", this.moveLocally);
		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;



	p.width=0;
	p.height=0;
	
	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};
	
	p.wrapTarget = function(owner,obj){
		console.log("---------------->>resizer");
		console.log(obj);
		owner.target=obj;
		var w=obj.width;
		var h=obj.height;
		var mc=this.bg.graphics;
		console.log(w+",X"+h+",   x:"+obj.x+",Y:"+obj.y);
		owner.x=obj.x;
		owner.y=obj.y;
		owner.box1=owner.box3.x=0;
		owner.box1=owner.box2.y=0;
		owner.box2.x=obj.width;
		owner.box3.y=obj.height;
		owner.box4.x=obj.width;
		owner.box4.y=obj.height;
		
		owner.boxr.x=obj.width*.5;
		owner.boxr.y=-60;
		var MC = this.bg.graphics;
		MC.beginStroke('red'); 
		MC.setStrokeStyle(2);
		var origin = new createjs.Point(0,0); 
		var midtp = new createjs.Point(obj.width*.5,0); 
		var tp= new createjs.Point(obj.width,0);
		var btm=new createjs.Point(obj.width,obj.height);
		var lft=new createjs.Point(0,obj.height);
		var rt=new createjs.Point(obj.width,obj.height);
		var rot=new createjs.Point(obj.width*.5,-60);
		//MC.beginFill('red'); 
		createLineSegments(MC,origin,tp);   //TOP
		createLineSegments(MC,origin,lft);	//LEFT
		createLineSegments(MC,lft,btm);		//BOTTOM
		createLineSegments(MC,tp,rt);		//RIGHT
		createLineSegments(MC,midtp,rot);	//ROTATION
	};
	
	function createLineSegments(MC,begin,end){
		var x1=begin.x;
		var x2=end.x;
		var y1=begin.y;
		var y2=end.y;
		d= Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
		console.log("d=="+d);
		//r = d%owner.segSize;
		tot =d/12;
		var lastX=begin.x;
		var lastY=begin.y;
		for (var i=0;i<tot; ++i){
			var x=begin.x*(i/tot);	
			var y=begin.y*(i/tot);	
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