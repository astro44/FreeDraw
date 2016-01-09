(function(scope) {
 'use strict';
 /**
 * Creates MenuBar to contian main buttons for whiteboard functions 
 * @param {String} id 
 * @param {String} label
 * @return {String} type
 * @return {String} color
 */
	///var scope;// SAME AS static dynamic var
	function MenuBar(id,label,type, color ) {
		this.Container_constructor();
		this.id=this.name=id;
		this.color = color;
		this.label = label;
		this.text = new createjs.Text("tools", "20px Arial", "#000");
		this.setup();
		this.currentMenu="";
	}
	
	var p = createjs.extend(MenuBar, createjs.Container);
	
	p.requestedMenu = function(value){
		this.currentMenu = value;
	}
	p.addChild = function(element){
		console.log(element.id);
		this.Container_addChild(element);
		this.setSize(element.x+element.width,element.y+element.height,'#'+Math.floor(Math.random()*16777215).toString(16));
		
		var kids = this.children;
		for (var i in kids){
			if (kids[i].type=="btn"){
				kids[i].x = Math.abs(this.width-kids[i].width)*.5;
			}
		}
	}
	p.width = function (value){
		console.log("@@!!!!@@@  "+this.getWidth());
		this.Container_width(value);
	}
	
	p.removeAllBtns = function (){
		var total=this.children.length;
		for (var i=0; i<total; ++i){
			console.log(this.children[i]);
			if (this.children[i].type=="btn"){
				this.removeChild(this.children[i]);
				--total;--i;
			}
		}
	}


	p.setup = function() {
		//var hitArea = new createjs.Shape();
		//hit.graphics.beginFill("#000").drawRect(0, 0, label2.getMeasuredWidth(), label2.getMeasuredHeight());
		//label2.hitArea = hit;
		/*var text = new createjs.Text("tools", "20px Arial", "#000");
		text.name=text.id="txt";
		text.textBaseline = "top";
		text.textAlign = "center";
		*/
		
		//var width = text.getMeasuredWidth()+30;
		//var height = text.getMeasuredHeight()+20;
		
		//scope = this;
		//text.x = width/2;
		//text.y = 10;
		
		var bg = new createjs.Shape();
		bg.name=bg.id="bg";
		bg.alpha=.5;
		//bg.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
		//bg.graphics.setStrokeStyle(5);
		//bg.graphics.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));
		//bg.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
		
		//this.addChild(bg, text); 
		this.addChild(bg); 

		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;

	p.width=0;
	p.height=0;
	
	p.setSize = function (width, height, color, all){
		var bg=this.getChildByName("bg");
		//console.log("set size now in MenuBar w:"+width);
		if (bg==null) throw new Error("FAILED to load bg in wbMenuBar");
		bg.graphics.clear()
				.beginStroke('#ccc')
				.beginFill(color)
				.drawRect(0,0,width,height);
		this.width=width;
		this.height=height;
		
		if (all){
			var total=this.children.length;
			for (var i=0; i<total; ++i){
				if (this.children[i].type=="btn")
					this.children[i].width=width;
					this.children[i].height=height;
			}
		}
		//bg.width=width;
		
	}
	p.getWidth = function(){
		return width;
	}
	
	p.getSize = function(){
		return new createjs.Point(this.width,this.height);
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
	

	scope.MenuBar = createjs.promote(MenuBar, "Container");
}(window.WBdraw));