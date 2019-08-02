import { 
	// Rectangle,
	// Matrix2D,
	// Stage,
	// Ticker,
	// Touch,
	Container,
	Shape,
	// EventDispatcher,
	Point
} from "@createjs/easeljs"; 

import { Tween } from "@createjs/tweenjs";

import {  promote } from  '../Utils'
// import ConfigWB from '../ConfigWB'
// import BrowserDetect from '../../BrowserDetect'

    // 'use strict';
    /**
    * Creates MenuBar to contian main buttons for whiteboard functions 
    * @param {String} id 
    * @param {String} label
    * @return {String} type
    * @return {String} color
    */
       ///var scope;// SAME AS static dynamic var
       class  MenuBar extends Container{
           constructor(id,label,type, color ) {
               super();
            //    this.Container_constructor();
                this.id=this.name=id;
                this.color = color;
                this.label = label;
                this.text = new Text("tools", "20px Arial", "#000");
                this.setup();
                this.currentMenu="";
            }


        requestedMenu = function(value){
            this.currentMenu = value;
        }
        addChild(element){
            console.log(element.id);
            super.addChild(element);
            this.setSize(element.x+element.width,element.y+element.height,'#'+Math.floor(Math.random()*16777215).toString(16));
            
            var kids = this.children;
            for (var i in kids){
                if (kids[i].type==="btn"){
                    kids[i].x = Math.abs(this.width-kids[i].width)*.5;
                }
            }
        }
        width = function (value){
            console.log("@@!!!!@@@  "+this.getWidth());
            this.Container_width(value);
        }
        
        removeAllBtns = function (){
            var total=this.children.length;
            for (var i=0; i<total; ++i){
                console.log(this.children[i]);
                if (this.children[i].type==="btn"){
                    this.removeChild(this.children[i]);
                    --total;--i;
                }
            }
        }


        setup = function() {
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
            this.scaleX=0;
            var bg = new Shape();
            bg.name=bg.id="bg";
            bg.alpha=.5;
            
            this.on("mousedown", this.handlePress);
            this.on("pressup", this.handleRelease);
            this.on("pressmove", this.moveLocally);
            //bg.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
            //bg.graphics.setStrokeStyle(5);
            //bg.graphics.beginStroke('#'+Math.floor(Math.random()*16777215).toString(16));
            //bg.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
            
            //this.addChild(bg, text); 
            this.addChild(bg); 

            
            this.offset = Math.random()*10;
            this.count = 0;
        } ;
        
            
        handlePress = function(event){
            event.stopImmediatePropagation();
        }
        handleRelease = function(event){
            event.stopImmediatePropagation();
        }
        moveLocally = function(event){
            event.stopImmediatePropagation();
        }
        

        width=0;
        height=0;
        
        setSize = function (width, height, color, all){
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
                    if (this.children[i].type==="btn")
                        this.children[i].width=width;
                        this.children[i].height=height;
                }
            }
            //bg.width=width;
            
        }
        getWidth = function(){
            return this.width;
        }
        
        getSize = function(){
            return new Point(this.width,this.height);
        }
        
        endDraw = function(event){
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
            Tween.get(target,{override:true}).to({scaleX:1, scaleY:1},100,
                // createjs.Ease.quadIn
                );
                
            }
        }
    }
       
    //    var p = createjs.extend(MenuBar, createjs.Container);
       
       
   
    //    scope.MenuBar = createjs.promote(MenuBar, "Container");
       export default promote(MenuBar, "Container")