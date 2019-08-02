
import { 
	Container,
	Shape,
} from "@createjs/easeljs"; 

import { promote } from  '../Utils'



    // 'use strict';
       ///var scope;// SAME AS static dynamic var
       class Box extends Container{
        constructor(id, color,  transparent) {
            super()
        //    this.Container_constructor();
           this.id=this.name=id;
           this.transparent=transparent;
           this.color = color;
           this.setup();
       }


       setup = function() {
            //var hitArea = new createjs.Shape();
            //hit.graphics.beginFill("#000").drawRect(0, 0, label2.getMeasuredWidth(), label2.getMeasuredHeight());
            //label2.hitArea = hit;
            
            var bg = new Shape();
            bg.snapToPixel=true;
            bg.alpha=1;
            bg.name=bg.id="bg";
            
        //	var v1 = new FormShape("m_id","ss","square","#FFF");
            
            
            //this.addChild(bg, v1); 
            this.on("click", this.handleClick);
            this.on("mousedown", this.handlePress);
            this.on("pressup", this.handleRelease);
            //this.on("pressmove", this.drawLine);
            
            console.log("box1");
            //this.cursor = "pointer";
            //this.mouseChildren = false;
            
            this.offset = Math.random()*10;
            this.count = 0;
        };
        
        width=0;
        height=0;
        
        setSize = function (width,height,color){
            this.width=width;
            this.height=height;
            if (this.transparent)return;
            var bg=this.getChildByName("bg");
            console.log("resizerrrBy");//.beginFill('#'+Math.floor(Math.random()*16777215))
            bg.graphics.clear()
                    .beginStroke('#ccc')
                    .beginFill(color)
                    .drawRect(0,0,width,height);
                    
            this.cache(0,0,width,height);
        };
        getWidth = function(){
            console.log("get width");
            return this.width;
        };

        handleClick = function (event) {
            //alert("You clicked on a button: "+this.label);
            console.log("click");
            event.stopImmediatePropagation();
        };
        
        handlePress = function(event){
            console.log(event);
            console.log("press");
            //event.stopImmediatePropagation();
        };
        handleRelease = function(event){
            
            console.log("release");
            console.log("release is now??")
            event.stopImmediatePropagation();
        };
        // out of scope below
        drawLine = function(event){
            console.log("draw");
            event.stopImmediatePropagation();
        };
        endDraw = function(event){
            console.log("enddraw");
            event.stopImmediatePropagation();
        };
        
    }
    //    var p = extend(Box, Container);
   
   
       
   
    //    scope.Box = createjs.promote(Box, "Container");
       export default promote(Box, "Container")