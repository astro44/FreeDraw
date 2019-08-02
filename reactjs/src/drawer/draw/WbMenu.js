import { 
	// Rectangle,
	Matrix2D,
	// Stage,
	// Ticker,
	// Touch,
	Container,
	Shape,
	EventDispatcher,
	// Point
} from "@createjs/easeljs"; 

import { Tween } from "@createjs/tweenjs";

import {  promote } from  '../Utils'
// import ConfigWB from '../ConfigWB'
// import BrowserDetect from '../../BrowserDetect'

import WbButton from './WbButton'
import WnMenuBar from './WnMenuBar'
import Trace from '../Trace'
    // 'use strict';  
   
    /**
    *@author Rcolvin
    * Creates Menu that holds MenuBar And sub menu
    * @param {String} id 
    * @return {String} color
    */
       ///var scope;// SAME AS static dynamic var
       class Menu extends Container{
           constructor(id, color ) {
               super();
        //    this.Container_constructor();
           this.id=this.name=id;
           this.color = color;
           this.hi_Y=0;
           this.Controller =null;
           this.matrix = new Matrix2D();
           this.angle = Math.PI/12;
           this.currentMenu="";
           //menu items
           this.options= {};
           this.subscriberWL = {"line":true,"fill":true,"math":true,"media":true,"select":false,"print":true,"clear":true,"modify":true,"text":true,"undo":true,"redo":true};
           this.hostWL = {"line":true,"fill":true,"math":true,"media":true,"select":true,"print":true,"clear":true,"modify":true,"text":true,"undo":true,"redo":true};
           /**
           * 
           * Each name for main menu MUST match a "class" name like "menu" to match "Menu"
           * sub menu names must match the function needed in Each class to SUPPORT drawing like "free" for free/freePerm 
           *
           **/
           this.options["BR"]=[ 
               {"name":"select", "btns":{"icon":"ss.png","hint":"select opject","action":"select"}},
               {"name":"line", "btns":{"icon":"ss.png","hint":"line",">":[{"name":"free","icon":"ss.png","action":"method1","hint":""},
                       {"name":"straight","icon":"ss.png","action":"method1","hint":""},
                       {"name":"bezier","icon":"ss.png","action":"method1","hint":""},
                       {"name":"links","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"fill", "btns":{"icon":"ss.png","hint":"fill",">":[{"name":"square","icon":"ss.png","action":"method1","hint":""},
                       {"name":"circle","icon":"ss.png","action":"method1","hint":""},
                       {"name":"star","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"math", "btns":{"icon":"ss.png","hint":"math",">":[{"name":"sqrt","icon":"ss.png","action":"method1","hint":""},
                       {"name":"axis","icon":"ss.png","action":"method1","hint":""},
                       {"name":"graph","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"media", "btns":{"icon":"ss.png","hint":"media",">":[{"name":"ppt","icon":"ss.png","action":"method1","hint":""},
                       {"name":"video","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"select_area", "btns":{"icon":"ss.png","hint":"selectable area",">":[{"name":"add","icon":"ss.png","action":"method1","hint":""},
                       {"name":"remove","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"text", "btns":{"icon":"ss.png","hint":"text area","action":"method1"}},
               {"name":"print", "btns":{"icon":"ss.png","hint":"selectable area","action":"print"}},
               {"name":"clear", "btns":{"icon":"ss.png","hint":"selectable area","action":"method1"}},
               {"name":"modify", "btns":{"icon":"ss.png","hint":"modify",">":[{"name":"delete","icon":"ss.png","action":"method1","hint":""},
                       {"name":"color","icon":"ss.png","action":"method1","hint":""},
                       {"name":"alpha","icon":"ss.png","action":"method1","hint":""},
                       {"name":"undo","icon":"ss.png","action":"method1","hint":""},
                       {"name":"redu","icon":"ss.png","action":"method1","hint":""}]}}
           ];
           this.options["EN"]=[ 
               {"name":"select", "btns":{"icon":"ss.png","hint":"select opject","action":"select"}},
               {"name":"line", "btns":{"icon":"ss.png","hint":"line",">":[{"name":"free","icon":"ss.png","action":"method1","hint":""},
                       {"name":"straight","icon":"ss.png","action":"method1","hint":""},
                       {"name":"bezier","icon":"ss.png","action":"method1","hint":""},
                       {"name":"links","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"fill", "btns":{"icon":"ss.png","hint":"fill",">":[{"name":"square","icon":"ss.png","action":"method1","hint":""},
                       {"name":"circle","icon":"ss.png","action":"method1","hint":""},
                       {"name":"star","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"math", "btns":{"icon":"ss.png","hint":"math",">":[{"name":"sqrt","icon":"ss.png","action":"method1","hint":""},
                       {"name":"axis","icon":"ss.png","action":"method1","hint":""},
                       {"name":"graph","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"media", "btns":{"icon":"ss.png","hint":"media",">":[{"name":"ppt","icon":"ss.png","action":"method1","hint":""},
                       {"name":"video","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"select_area", "btns":{"icon":"ss.png","hint":"selectable area",">":[{"name":"add","icon":"ss.png","action":"method1","hint":""},
                       {"name":"remove","icon":"ss.png","action":"method1","hint":""}]}},
               {"name":"text", "btns":{"icon":"ss.png","hint":"text area","action":"method1"}},
               {"name":"print", "btns":{"icon":"ss.png","hint":"selectable area","action":"print"}},
               {"name":"clear", "btns":{"icon":"ss.png","hint":"selectable area","action":"method1"}},
               {"name":"modify", "btns":{"icon":"ss.png","hint":"modify",">":[{"name":"delete","icon":"ss.png","action":"method1","hint":""},
                       {"name":"color","icon":"ss.png","action":"method1","hint":""},
                       {"name":"alpha","icon":"ss.png","action":"method1","hint":""},
                       {"name":"undo","icon":"ss.png","action":"method1","hint":""},
                       {"name":"redu","icon":"ss.png","action":"method1","hint":""}]}}
           ];
           
           this.setup();
       }


    getLayer = function (id){ 
        return this.layers[id]; 
    }

    hi_Y=0;
    width=0;
    height=0;
    
    setup = function() {
        var bg = new Shape();
        var hi = new Shape();
        bg.alpha=1;
        bg.name=bg.id="bg";
        hi.alpha=1;
        hi.name=hi.id="hi";
        
        this.menucontain= new WnMenuBar("wbmenu");
        this.menucontain.scaleX=1;
        this.submenu= new WnMenuBar("sub_wbmenu");
        this.menubuttons(this.options);
        bg.snapToPixel=true;
        this.menucontain.snapToPixel=true;
        hi.snapToPixel=true;
        this.submenu.snapToPixel=true;
        this.addChild(bg,this.menucontain,hi,this.submenu);
        
        this.on("mousedown", this.handlePress);
        this.on("pressup", this.handleRelease);
        this.on("pressmove", this.moveLocally);
        
        Trace("box1");
        //this.cursor = "pointer";
        //this.mouseChildren = false;
        
        this.offset = Math.random()*10;
        this.count = 0;
    };
    
    
    setSize = function (width,height,color){
        this.setBgSize(width,height,color);
        this.width=width;
        this.height=height;
        for (var i in this.layers){
            this.layers[i].setSize(width,height,color);
        }
        this.width=width;
        this.height=height;
    };
    
    setBgSize = function(width,height,color){
        var bg=this.getChildByName("bg");
        if (bg!=null){
            bg.graphics.clear()
                    .beginStroke('#ccc')
                    .beginFill(color)
                    .drawRect(0,0,width,height);
        }
    }
    setHiSize = function(width,height,color){
        var hi=this.getChildByName("hi");
        if (hi!=null){
            hi.graphics.clear()
                    .beginFill(color)
                    .drawRect(0,0,width,height);
        }
    }
    getWidth = function(){
        Trace("get width");
        return this.width;
    }
    wbRegister = function (wbid,tabid){
        
    }
    clear = function(type,wbid){
        //clear all objects in view based on type  ;
    }
    wbSwitch = function (wbid){
        
    }
    unshift =function(items){}//to front
    push =function(items){}//toback
    

    handlePress = function(event){
        event.stopImmediatePropagation();
    }
    handleRelease = function(event){
        event.stopImmediatePropagation();
    }
    moveLocally = function(event){
        event.stopImmediatePropagation();
    }
    


    menubuttons = function(buttons, language){
        if (language==null) language = "EN";
        var options =  buttons[language];   //array
        var stot = options.length;
        this.hostWL=null;
        var old=null;
        // var btn=null;
        var invoke=this.oInvoke;
        var btn = new WbButton("up","up.png","back to menu",'up','#999',oUp);
        this.menucontain.addChild(btn);
        old=btn;
        for (var i =0;i<stot;++i){
            var opt = options[i];
            if ( !this.subscriberWL[opt["name"]] ){
                continue;
            }
            invoke=(opt["btns"][">"]===undefined || opt["btns"][">"]===null? oInvoke : invoke=oInvokeSub);
            btn = new WbButton(opt["name"],opt["btns"]["icon"],opt["btns"]["hint"],opt["name"],'#'+Math.floor(Math.random()*16777215).toString(16),invoke);
            if (old!=null){
                btn.x=0;
                btn.y=old.y+old.height+10;
            }else{
                btn.x=btn.y=0;
            }		
            btn.alpha=.5;
            this.menucontain.addChild(btn,(old==null?true:false));
            
            old = btn;
        }
        Trace("________done...");
        var mPoint=this.menucontain.getSize();
        //this.setSize(mPoint.x,mPoint.y);
        console.log(mPoint);
        //this.menucontain.x=400
        
        var tween = Tween.get(this).wait(1);
        tween.wait(300).call(this.setBgSize,[mPoint.x,mPoint.y, "#DDD"],this);
        //this.setBgSize(120,200, Math.floor(Math.random()*16777215).toString(16));
        
    }

}
       EventDispatcher.initialize(Menu.prototype);
    //    var p = createjs.extend(Menu, createjs.Container);
       
       
       function oBack(btn,btnID){
           var owner = btn.parent.parent;
           animateOut(owner);
       }	
       function oUp(btn,btnID){
        //    var owner = btn.parent.parent;
           //animateOut(owner);
       }
       
       function subButtons(owner,aBtns,selected, language){
           if (language==null) language = "EN";
           var options =  aBtns[language];   //array
           var stot = options.length;
           owner.hostWL=null;
           var old=null;
           if (owner.submenu.currentMenu!==selected){
               owner.submenu.requestedMenu(selected);
               owner.submenu.removeAllBtns();
               var btn = new WbButton("back","back.png","back to menu",'back','#999',oBack);
               owner.submenu.addChild(btn);
               old=btn;
               for (var i =0;i<stot;++i){
                   var opt=options[i];
                   if ( !owner.subscriberWL[opt["name"]] || opt["name"] !== selected)
                       continue;
                   var subs = opt["btns"][">"];
                   stot = subs.length;
                   for (var j=0; j < stot; ++j){
                       btn = new WbButton(subs[j]["name"],subs[j]["icon"],subs[j]["hint"],subs[j]["name"],'#'+Math.floor(Math.random()*16777215).toString(16),oInvoke);
                       if (old!=null){
                           btn.x=0;
                           btn.y=old.y+old.height+10;
                       }else{
                           btn.x=btn.y=0;
                       }		
                       btn.alpha=.5;
                       owner.submenu.addChild(btn);
                       old = btn;
                   }
                   break;
               }
               Trace(".........FINISHED ");
               owner.submenu.setSize(owner.menucontain.width,owner.menucontain.height,'#'+Math.floor(Math.random()*16777215).toString(16),true)
               owner.submenu.x=owner.menucontain.width;
               owner.submenu.scaleX=0;
           }
           animateIn(owner);
       }
       
       function animateOut(owner){
           Tween.get(owner.submenu, {override:true}).to({x: owner.menucontain.width, scaleX:0}, 250, 
            // createjs.Ease.quadIn
            );
           Tween.get(owner.menucontain, {override:true}).to({x: 0, scaleX:1}, 250, 
            // createjs.Ease.quadIn
            );
           Trace("----->OUT");
           Trace(owner);
           Trace(owner.hi_Y);
           if (owner.hi_Y!==0){
               var hi=owner.getChildByName("hi");
               Tween.get(hi, {override:true}).to({y:owner.hi_Y},250,
                // createjs.Ease.quadIn
                );
           }
       }
       
       function animateIn(owner){
           Tween.get(owner.submenu, {override:true}).to({x:0,scaleX:1},250,
            // createjs.Ease.quadIn
            );
           Tween.get(owner.menucontain, {override:true}).to({x:0, scaleX:.01},250,
            // createjs.Ease.quadIn
            );
           Trace("----->IN");
           Trace(owner.hi_Y);
           if (owner.hi_Y!==0){
               var hi=owner.getChildByName("hi");
               Tween.get(hi, {override:true}).to({y:-20},250,
                // createjs.Ease.quadIn
                );
           }
       }
           
       function oInvokeSub(btn,btnID){ 
           var m = btn.parent.parent;
           if (m.options===undefined || m.options===null){
               console.log("[E] submenu functions out of context. Please make sure function is delegated");
           }
           subButtons(m,m.options,btnID);
       }
       
       function getMainByBtn(owner,btn){
           var options =  owner.options["EN"];   //array
           var tot = options.length;
           for (var i=0;i<tot;++i){
               var opt = options[i];
               var subs = opt["btns"][">"];
               if (subs !== undefined && subs !== null){
                   var stot = subs.length;
                   for (var j=0;j<stot;++j){
                       if(subs[j]["name"] === btn.name)	
                       return [opt.name,btn.name];
                   }
               }
           }
           return [btn.name];
       }
       
       function oInvoke(btn,btnID){
           //alert(" execute   function directly in controller for immediate or subMenu effect:: "+btnID);
           var owner = btn.parent.parent;
           var hi=owner.getChildByName("hi");
           var form="";
           var subType="";
           var mbtn;
           if (owner.submenu.scaleX===0){
               form=btn.name;
               mbtn=btn;
           }else{
               mbtn=owner.menucontain.getChildByName(owner.submenu.currentMenu);
               var w=4;
               var types = getMainByBtn(owner,btn);
               console.log("....submenu Button pressed...");
               if (types.length>1){
                   form=types[0];
                   subType=types[1];
               }
           }
           hi.x = owner.menucontain.x + owner.menucontain.width;
           if (mbtn!=null){
               owner.hi_Y = mbtn.y;
               //hi.y = mbtn.y;
               owner.setHiSize(w,mbtn.height,'#FF0000');
           }
           Trace("---==>> ||>>  main:"+ form +"  sub:"+ subType);
           
           //owner.controller.drawinit(form,subType);
           //drawinit
           
               Trace("........---------__bb__--->>>>>   event Controller>>>>>   ");
           var myevent = {
                type: "MenuEvent",
                param: [form,subType]
              };
           owner.dispatchEvent(myevent);
           
           if (owner.submenu.x===0)
               animateOut(owner);
           
           //createjs.Tween.get(hi, {override:true}).to({y:-10},250,createjs.Ease.quadIn);
       }
    //    scope.Menu = createjs.promote(Menu, "Container");
       export default promote(Menu, "Container")