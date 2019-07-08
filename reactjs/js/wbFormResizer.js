(function(scope) {
 // 'use strict';
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
		this.formTargetLAST=null;
		this.box1=null;
		this.box2=null;
		this.box3=null;
		this.box4=null;
		this.boxr=null;
		this.boxm=null;
		this.TXT=null
		this.setup();
		console.log ("@@@@@@  NEW FormResize  ");
	}
	createjs.EventDispatcher.initialize(FormResize.prototype);
	var p = createjs.extend(FormResize, createjs.Container);
	
	function bx1_move(btn,btn_name){
		if (this.TXT!==null)
			//this.TXT.visible=false;
			console.log("<<<<<<<<<<   003  >>>>>>>>>>");
		if (btn_name.indexOf("r")!=-1)
			btn.on("pressmove", moveitR.bind(this));  //btn.on("pressmove", moveitR.bind(this));
		else if (btn_name.indexOf("m")!=-1)
			btn.on("pressmove", moveitM.bind(this));
		else
			btn.on("pressmove", moveit.bind(this));
		return "";
	}	
	function bx1_stop(btn,btn_name){
			btn.off("pressmove");
			console.log("bx1------------>>>>>>>>>>>> stop"+this.formTarget.type);
			var pt= this.formTarget.globalToLocal(this.box4.x*2,this.box4.y*2);
			this.rotation=this.formTarget.rotation;
			//this.formTargetLAST=this.formTarget;
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
			if (this.TXT!==null){
				this.TXT.visible=true;
				resizeEditor(this,this.formTarget);
			}
		this.formTarget.commit("resize");
		return "";
	}
	
	function moveitR(event){
		var pt = this.globalToLocal(event.stageX,event.stageY);
		var angle=cAngle({x:0,y:0},pt);
		this.formTarget.rotation=angle+this.rotation;//this.rotation;
		if (this.formTarget.type=="text")
			this.rotation=angle+this.rotation;//this.rotation;
			
	}	
	function moveitM(event){
		//var pt = this.globalToLocal(event.stageX,event.stageY);
		this.x=event.stageX;
		this.y=event.stageY+this.formTarget.height*.5+10;
		
		this.formTarget.x =this.x;
		this.formTarget.y =this.y;
		
			
	}
	function moveit(event){
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
		if (midW<10 || midH<10){
			rFail=true;
		}
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
		
		
		
		if (rFail){
			bx.x=oldX;
			bx.y=oldY;
			return;
		}
		positionBoxes(this,midW*2,midH*2,bx)
		miniWrap(this,Math.ceil(nX) ,Math.ceil(nY))
	
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
		this.boxm=new WBdraw.resizeBtn("bxm", "#FFF",bx1_move.bind(this),bx1_stop.bind(this));
		
		// var he = window.WBdraw.getCanvasDiv("editTxt");
		// he.style.display="none";
		// he.innerHTML='<textarea name="txt2edit" id="txt2edit" placeholder="enter text here" cols="" rows="" style="width:inherit;font-size:20px; lineHeight:1.0em" readOnly></textarea>';
		// //he.readOnly=false;
		// //he.style.width='60%';
		
		// var dd = window.WBdraw.getCanvasDiv("txt2edit");
		// //var dd = ReactDOM.findDOMNode(this.refs.editTxt);
		

		// dd.style.background="rgba(0,0,0,0)";
		// dd.style.color = "black";
		// dd.style.border = "none";
		// dd.style.overflow = "hidden";
		// dd.style.fontFamily="Arial";
		// dd.style.padding="8px";
		// dd.style.fontSize="20px";
		// dd.style.lineHeight="1.0em";
		
		// var owner=this;
		// dd.onclick=function (e){
		// 	dd.readOnly=false;
		// }
		// //dd.onfocus=function (e){dd.value="dude"}
		// dd.onblur=function (e){
		// 	//commit change
		// 	if (owner.formTargetLAST!=null){
		// 		owner.formTargetLAST.setText(dd.value);
				
				
		// 		owner.formTarget.x=owner.x-owner.box4.x+owner.tolerance;
		// 		owner.formTarget.y=owner.y-owner.box4.y+owner.tolerance;
		// 		owner.formTarget.drawTemp((owner.box4.x*2)-owner.tolerance*2,(owner.box4.y*2)-owner.tolerance*2);
		// 		owner.formTarget.drawPerm(owner.formTarget);
				
		// 		owner.formTargetLAST.commit("text");
		// 		if (owner.formTarget!=owner.formTargetLAST)
		// 			owner.formTargetLAST.visible=true;
		// 		//if (owner.parent==null)
		// 			//owner.formTargetLAST.visible=true;
		// 	}
		// 	owner.formTargetLAST=null;
		// }
		/*dd.onkeypress=function (e){
			var code = e.which || e.keyCode;
			console.log(code);
			//if (code == 13){
				//commit change
			//}
		}
		dd.onkeydown=function (e){
			var code = e.which || e.keyCode;
			console.log(code);
			}*/
		// this.TXT=new createjs.DOMElement(he);
		this.bg.snapToPixel=true;
		this.box1.snapToPixel=true;
		this.box2.snapToPixel=true;
		this.box3.snapToPixel=true;
		this.box4.snapToPixel=true;
		this.boxr.snapToPixel=true;
		
		this.boxm.resize(50,20);
		this.boxm.snapToPixel=true;
		
		// this.TXT.snapToPixel=true;
		// this.addChild(this.bg,this.box1,this.box2,this.box3,this.box4,this.boxr,this.boxm,this.TXT); 
		this.addChild(this.bg,this.box1,this.box2,this.box3,this.box4,this.boxr,this.boxm,this.TXT); 
		
		
	} ;

	p.EMPTY = function (){
		if (this.formTarget!=null){
				return this.formTarget.EMPTY();
		}
		return false;
	}

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
		// var he = window.WBdraw.getCanvasDiv("editTxt");
		// 	var dd = window.WBdraw.getCanvasDiv("txt2edit");
		if (obj==null){
				// dd.blur();
			if (owner.formTarget!=null){
				owner.formTarget.scaleState(false);
				if(owner.formTarget.type=="text"){
					owner.formTarget.visible=true;
				}
				 
				owner.formTargetLAST=owner.formTarget;
			}
			owner.formTarget=null;
			if (owner.parent)
				owner.parent.removeChild(this);
			//he.style.display='none';
		}else{
			this.rotation=obj.rotation;
			var isText=(obj.type=="text");
			if (isText){
				// dd.blur();
				//owner.formTarget.visible=true;
			}
			
			owner.formTargetLAST=owner.formTarget;
			owner.formTarget=obj;
			owner.x=obj.x;
			owner.y=obj.y;
			var midW=Math.ceil(obj.width*.5)+owner.tolerance;
			var midH=Math.ceil(obj.height*.5)+owner.tolerance;
			
			owner.box4.visible=owner.box3.visible=owner.box2.visible=owner.box1.visible = obj.elastic;
			owner.boxr.visible =owner.boxm.visible = obj.rotary;
			resizeEditor(owner,obj);
			positionBoxes(owner,midW,midH,"")
			miniWrap(owner,midW,midH);
			if (owner.formTarget!=null){
				if (isText){
					owner.formTargetLAST=owner.formTarget
					if (owner.formTarget.text.text!=""){
						//he.style.display='block';
						console.log("<<<<<<<<<<   001  >>>>>>>>>>");
						if (owner.formTarget.text.text !="enter text here")
							// dd.value=owner.formTarget.text.text;
						owner.formTarget.visible=false;
						if (!BrowserDetect.isIOS() && !BrowserDetect.isAndroid() ){
							// dd.focus();
							//if (dd.value=="enter text here"){
								//dd.select();
							//}
						}
					}
				}else{
					//he.style.display='none';
				}
			}
		}
		
	}
	

	
	function resizeEditor(owner,obj){
		// var he = window.WBdraw.getCanvasDiv("editTxt");
		// var te=window.WBdraw.getCanvasDiv("txt2edit");
		// te.style.width="inherit";
		// 	he.style.width=obj.width+"px";
		// te.style.height="inherit";
		// 	var lh=obj.height-10;
		// 	he.style.height=lh+"px";
			
		// 	var midW=Math.ceil(obj.width*.5)+owner.tolerance;
		// 	var midH=Math.ceil(obj.height*.5)+owner.tolerance;
		// 	owner.TXT.x=-midW+5;
		// 	owner.TXT.y=-midH+5;
		//if (owner.formTarget.type == "text")
		//	owner.formTargetLAST.visible=true;
			
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
		owner.boxm.x=0;
		owner.boxm.y=-midH;
		owner.boxr.y=-60-midH;
	}
		
	function miniWrap(owner,midW,midH){
		var MC = owner.bg.graphics;
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
		if (owner.boxr.visible)
			createLineSegments(MC,rot,midtp,true);		//ROTATION
	};
		
	
	function createLineSegments(MC,begin,end,isVert){
		var x1=dx1=begin.x;
		var x2=dx2=end.x;
		var y1=dy1=begin.y;
		var y2=dy2=end.y;
		d= Math.sqrt( (dx2-=dx1)*dx2 + (dy2-=dy1)*dy2 );

		tot =(d/12);
		//myGraphics.setStrokeDash([20, 10], 0);  //20 px then 10px gap  0 marching ants effect
		var lastX=begin.x;
		var lastY=begin.y;
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
	



	
	

	scope.FormResize = createjs.promote(FormResize, "Container");
}(window.WBdraw));