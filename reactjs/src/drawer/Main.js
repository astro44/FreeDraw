
import { Stage, Ticker, Touch  } from "@createjs/easeljs";
import BrowserDetect from './BrowserDetect'
import WBdraw from './WbDraw'
import WBoard from './draw/WBoard'

function Main(){}

Main.main = function(canvas, mainTxt){
	var main = new Main();
	main.initialize(canvas, mainTxt);
	return main;
}

Main.prototype.initialize = function(canvas, mainTxt){
	/**
	* mainCanvas  keep canvas at 3/4 and ~4/3.
	*/
	// this.mainCanvas = document.getElementById("mainCanvas");
	this.mainTxt = mainTxt;
	this.mainCanvas = canvas;
	this.mainCanvas.setStrokeStyle="#FF0000";
	/**
	* mainStage -- CAN NOT USE WEBGL since it <shape> can NOT be added.
	*/
	this.mainStage = new  Stage(this.mainCanvas);
	//this.mainStage = new createjs.SpriteStage(this.mainCanvas,false,false);
	this.mainStage.snapToPixelsEnabled = true;
	this.mainStage.id="mainIn";
	window.mainStage =this.mainStage;
	this.mainStage.enableMouseOver(10);
	
	// var stats = new Stats();
	// var stats1 = new Stats();
	// var stats2 = new Stats();
	// stats.setMode( 0 )
	// stats1.setMode( 1 )
	// stats2.setMode( 2 )
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.left = '0px';
	// stats.domElement.style.bottom = '10px';
	// document.body.appendChild( stats.domElement );
	// window.stats=stats;
	// stats1.domElement.style.position = 'absolute';
	// stats1.domElement.style.left = '90px';
	// stats1.domElement.style.bottom = '10px';
	// document.body.appendChild( stats1.domElement );
	// window.stats1=stats1;
	// stats2.domElement.style.position = 'absolute';
	// stats2.domElement.style.left = '180px';
	// stats2.domElement.style.bottom = '10px';
	// document.body.appendChild( stats2.domElement );
	// window.stats2=stats2;
	//this.window.meter=meter;
	/*
	* createjs
	*/
	Ticker.addEventListener("tick", this.mainStage);
	//createjs.Ticker.timingMode = createjs.Ticker.RAF;
	Ticker.timingMode = Ticker.RAF_SYNCHED;
	// Ticker.setFPS(60);
	const _mainStage = this.mainStage
	Ticker.on("tick",function (event){
        // debugger
            var board1=_mainStage.getChildByName("BASE_main");
            
            // window.stats.begin();
            // window.stats1.begin();
            // window.stats2.begin();
            //below only works with canvas NOT WEBGL  (*
            //if (!_mainStage.isWebGL){
                if (board1.width != _mainStage.canvas.width || board1.height != _mainStage.canvas.height){
                    board1.setSize(_mainStage.canvas.width,_mainStage.canvas.height, '#CCC');
                    console.log("abc tick  width:"+board1.width+"  widthCvs:"+ _mainStage.canvas.width+"  height:"+board1.height+"  heightCvs:"+_mainStage.canvas.height)
                    
                    initSIZE(_mainStage);
                }
            //}
            //mainStage.update();		
            
            // window.stats.end();
            // window.stats1.end();
            // window.stats2.end();
        });
	
	Touch.enable(this.mainStage);
	this.mainStage.enableMouseOver();
	//this.mainStage.enableDOMEvents(true);
	window.WBdraw.trace("main...start");
	window.WBdraw.trace( BrowserDetect.browser);
	window.WBdraw.trace( BrowserDetect.version);
	window.WBdraw.trace( BrowserDetect.os);
	window.WBdraw.trace( BrowserDetect.isIOS());
	
	var board1= new WBoard("BASE_main","#ccc");
	board1.snapToPixel=true;
	board1.resizer.dd=this.mainTxt;
	board1.resizer.setup();
	WBdraw.currentBoard = board1;
    
    
	this.mainStage.addChild(board1);
    board1.setMainStage(this.mainStage);
}
Main.prototype.getBoard = function(){
	return this.mainStage.getChildByName("BASE_main");
}
// Main.prototype.tick =
	/*primarily mobile fixed size*/
	function initSIZE(stage){
		var canvas = stage.canvas;
		//below only works with canvas NOT WEBGL
		
		//if (!mainStage.isWebGL){
			if (canvas !=undefined){
				var board1=stage.getChildByName("BASE_main");
				var wbInfo =new window.WBdraw.ConfigWB( BrowserDetect.os, board1.width, board1.height);
				//var wbInfo = window.WBdraw.ConfigWB;
				window.WBdraw.trace(wbInfo.width +", "+wbInfo.height+", "+wbInfo.scaleFactor);
				// Set the Canvas size
				canvas.width = wbInfo.width;
				canvas.height = wbInfo.height;
				// On hi-resolution platforms, we need to counter-scale.
				canvas.style.width = wbInfo.width * wbInfo.scaleFactor + "px";
				canvas.style.height = wbInfo.height * wbInfo.scaleFactor + "px";
				
				//now intialize WBoard
			}
		//}
    }
    
    export default Main