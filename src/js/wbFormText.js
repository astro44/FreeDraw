(function(scope) {
 'use strict';
	///var scope;// SAME AS static dynamic var
	function FormText(id,type) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = "000";
		this.type=type;
		this.limitDraw=false;
		this.rect=null;
		this.segSize=12;
		this.regX=0;
		this.regY=0;
		this.scaled=false;
		this.rel=null;   		//relative coordinates
		this.text=null;
		this.tempOrigin=null;
		this.lastXY={x:0,y:0};
		this.points=[];
		this.related=null;
		this.biderectional=false;
		this.label="enter text here";
		this.elastic=true;
		this.rotary=true;
		this.setup();
	}
	createjs.EventDispatcher.initialize(FormText.prototype);
	var p = createjs.extend(FormText, createjs.Container);

	p.setup = function() {
		//this.l
	this.bg = new createjs.Shape();
	this.bg.snapToPixel=true;
	this.hitHelper = new createjs.Shape();
	this.hitHelper.snapToPixel=true;
			this.text = new createjs.Text(this.label, "20px Arial", "#000");
			this.text.font = "20px Arial";
			//this.text.font = "bold 20px Arial";
			this.text.color = "#000000";
			this.text.padding="8px";
			//this.text.y=-10;
			//this.text.lineHeight= "1em";
	this.text.snapToPixel=true;
	this.text.hitArea=this.hitHelper;
		this.addChild(this.bg,this.text); 
		
		this.on("mousedown", this.handlePress.bind(this));
		this.on("pressup", this.handleRelease.bind(this));
		//this.on("pressmove", this.moveLocally.bind(this));
		this.cursor = "pointer";
		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
		
			this.text.name = this.text.id="txt";
			//this.text.text="hiya";
			this.text.textBaseline = "top";
			this.text.textAlign = "left";
			this.text.wordWrap = true;
			this.width = this.text.getMeasuredWidth()+30;
				this.height = this.text.getMeasuredHeight()+20;
		this.points.push(new createjs.Point(this.text.getMeasuredWidth()+30,this.text.getMeasuredHeight()+20));
		this.squarePerm(this);
		this.status=window.WBdraw.FormProxy.NEW;
	} ;

	p.setText=function(text){
		this.text.text=text;
		this.updateCache();
	}
	
	p.drawTemp= function (fx,fy) {
		this.uncache();
		//this.bg.visible=true;
		this.bg.alpha=1;
		this.square(this,fx,fy);
	}
	
	p.drawPerm= function (shape,init) {
		if (shape.id !=this.id)
			return;
		try{
			var finalIn=this.squarePerm(this,shape,init);
		}catch(err){
			console.log(err);
			throw "[E] No function matches:"+this.type+"Perm() in FormText (wbFormText.js)";
			
		}
		  // var myevent = {
			// type: "CommitEvent",
			// param: this
		  // };
		  console.log("...create....");
		if (finalIn)
			this.commit(window.WBdraw.FormProxy.UPDATE);
			//this.dispatchEvent(myevent);
	}
	p.commit = function (action){
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
		
		  console.log("...moved....");
		this.commit(window.WBdraw.FormProxy.MOVED);
		this.lastXY.x=this.x;
		this.lastXY.y=this.y;
		//event.stopImmediatePropagation();
	}
	
	
	
	p.handlePress = function(event){
		  console.log("...handlePress....");
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
			MC.beginStroke('#000'); 
			MC.beginFill('#FFF'); 
			MC.rect(0,0,lc.x, lc.y);
		owner.points.push(lc);
		MC.endStroke();
		MC.endFill(); 
		//this.cache(0,0,inX,inY);
	}
	
	
	function convert2pos(owner,lc){
		if (lc.x<0){//moveBy in the + direction X
			lc.x=Math.abs(lc.x);
			owner.x-=lc.x;
		}
		if (lc.y<0){//moveBy in the + direction Y
			lc.y=Math.abs(lc.y);
			owner.y-=lc.y;
		}
		return lc;
	}
	p.squarePerm = function(owner,shape,init){
		
		var MC =owner.bg.graphics;
		var HTC =owner.text.hitArea.graphics;
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
		

		
		
		olc = owner.points[0];
		lc = convert2pos(owner,olc);
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
		owner.height=Math.abs(inY)+strokeIn;
	
		
		if (owner.width<30 || owner.height<20){	
			if (owner.width< owner.text.getMeasuredWidth()  ){
				owner.width = owner.text.getMeasuredWidth()+30;
			}
			if (owner.height<owner.text.getMeasuredHeight()){
				owner.height = owner.text.getMeasuredHeight()+20;
			}
		}
		MC.setStrokeStyle(strokeIn);
		MC.beginStroke('#000');  
		MC.beginFill('#FFF'); 
		HTC.setStrokeStyle(strokeIn*2);
		HTC.beginStroke('#000'); 
		HTC.beginFill('red');  
        HTC.rect(0,0,inX,inY);
		MC.rect(0,0,inX,inY);
		
        MC.endStroke();
        HTC.endStroke();
		HTC.endFill(); 
		MC.endFill(); 
		owner.text.x=owner.text.y=strokeIn;
		owner.text.lineWidth=inX;
		owner.text.width=inX;
		owner.text.height=inY;
		
		owner.bg.visible=false;
		
		//owner.cache(-strokeIn,-strokeIn,inX+strokeIn*2,inY+strokeIn*2);
		owner.cache(-strokeIn+(inX<0?inX:0),-strokeIn+(inY<0?inY:0), owner.width+strokeIn*2,owner.height+strokeIn*2);
		
		return true;
	}

	
	p.destroy = function(fromJMS){
		this.uncache();
		this._commited = false;
		
	}


	
	scope.FormText = createjs.promote(FormText, "Container");
}(window.WBdraw));