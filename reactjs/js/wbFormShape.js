(function(scope) {
 // 'use strict';
	///var scope;// SAME AS static dynamic var
	function FormShape(id,label,type, color ) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = color;
		this.type=type
		this.label = label;
		this.setup();
		this._commited = false;
	}
	var p = createjs.extend(FormShape, createjs.Container);


	p.setup = function() {
		//var hitArea = new createjs.Shape();
		//hit.graphics.beginFill("#000").drawRect(0, 0, label2.getMeasuredWidth(), label2.getMeasuredHeight());
		//label2.hitArea = hit;
		var text = new createjs.Text(this.label, "20px Arial", "#000");
		text.name=text.id="txt";
		text.textBaseline = "top";
		text.textAlign = "center";
		
		var width = text.getMeasuredWidth()+30;
		var height = text.getMeasuredHeight()+20;
		
		//scope = this;
		text.x = width/2;
		text.y = 10;
		
		var bg = new createjs.Shape();
		bg.name=bg.id="bg";
		//bg.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
		bg.graphics.setStrokeStyle(5);
		bg.graphics.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));
		bg.graphics.beginFill(this.color).drawRoundRect(0, 0, width, height, 10);
		
		this.addChild(bg, text); 
		this.on("click", this.handleClick);
		this.on("rollover", this.handleRollOver);
		this.on("rollout", this.handleRollOver);
		this.on("mousedown", this.handlePress);
		this.on("pressup", this.handleRelease);
		this.cursor = "pointer";

		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;

	p.handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
	} ;
	p.hello = function (msg){
		console.log(msg);
		p.width=100;
	}
		
		p.width=0;
	p.height=0;
	
	p.setSize = function (width,height,color){
		var bg=target.getChildByName("bg");
		bg.graphics.clear()
				.beginStroke('#ccc')
				.beginFill('#'+Math.floor(Math.random()*16777215))
				.drawRect(0,0,width,height);
		p.width=width;
		p.height=height;
	}
	p.getWidth = function(){
		return width;
	}
	
	p.handlePress = function(event){
        mainStage.addEventListener("stagemousemove", this.drawLine);
        mainStage.addEventListener("stagemouseup", this.endDraw);
		console.log(this.id);
		if (!this.scaled){
		createjs.Tween.get(this,{override:true}).to({scaleX:1.1, scaleY:1.1},100,createjs.Ease.quadIn);
		this.scaled=true
		this.rel=this.globalToLocal(mainStage.mouseX,mainStage.mouseY);
		}
	}
	p.handleRelease = function(event){
        mainStage.removeEventListener("stagemousemove", this.drawLine);
        mainStage.removeEventListener("stagemouseup", this.endDraw);
		
	   var myevent = {
		 type: "SelectEvent",
		 param: this
	   };
	   this.dispatchEvent(myevent);
	}
	
	// out of scope below
	p.drawLine = function(event){
		//console.log(mainStage.mouseX+","+mainStage.mouseY);
		var mStage = event.target;		
		var target, targets = mStage.getObjectsUnderPoint(mStage.mouseX, mStage.mouseY, 1);
        for (var i=0; i<targets.length; i++) {
            if (targets[i].parent.scaled) {
                target = targets[i].parent;
                break;
            }
        }

        if (target != null) {
			target.x=mStage.mouseX-target.rel.x;
			target.y=mStage.mouseY-target.rel.y;
			var bg=target.getChildByName("bg");
			bg.graphics.clear()
				.beginStroke('#'+Math.floor(Math.random()*16777215))
				.beginFill('#'+Math.floor(Math.random()*16777215))
				.drawRect(0,0,mStage.mouseX,mStage.mouseY)
			
        } else {
            //createjs.Tween.get(connection).to({alpha:0}, 1200, createjs.Ease.quadOut).call(function(event) {
                //stage.removeChild(event.target.target);
            //});
		}
       
	}
	
	
	p.endDraw = function(event){
		var mStage = event.target;
		var target, targets = mStage.getObjectsUnderPoint(mStage.mouseX, mStage.mouseY, 1);
        for (var i=0; i<targets.length; i++) {
            if (targets[i].parent.scaled) {
                target = targets[i].parent;
                break;
            }
        }
		console.log(target.scaled);
        if (target != null) {
			target.scaled=false;
		createjs.Tween.get(target,{override:true}).to({scaleX:1, scaleY:1},100,createjs.Ease.quadIn);
			
        }
	}
	

	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};

	scope.FormShape = createjs.promote(FormShape, "Container");
}(window.WBdraw));