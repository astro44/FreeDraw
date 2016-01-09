/** @define {string} */
var BUILD = "debug";

(function(scope){

function Main(){}

Main.main = function(){
	var main = new Main();
	main.initialize();
}
//Main.prototype.registerInvoker= function(){
	//register method to be used
//}

/**
* Initializes the basics of the app.
*/
Main.prototype.initialize = function(){
	/**
	* mainCanvas
	*/
	this.mainCanvas = document.getElementById("mainCanvas");
	this.mainCanvas.setStrokeStyle="#FF0000"
	/**
	* mainStage
	*/
	this.mainStage = new createjs.Stage(this.mainCanvas);
	this.mainStage.snapToPixelsEnabled = true;
	this.mainStage.id="mainIn";
	window.mainStage =this.mainStage;
	this.mainStage.enableMouseOver(10);
	/*
	* createjs
	*/
	createjs.Ticker.addEventListener("tick", this.mainStage);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(30);
	
	createjs.Ticker.on("tick",tick);
	
	createjs.Touch.enable(this.mainStage);
	this.mainStage.enableMouseOver();
	//this.mainStage.enableDOMEvents(true);
	window.WBdraw.trace("main...start");
	window.WBdraw.trace( BrowserDetect.browser);
	window.WBdraw.trace( BrowserDetect.version);
	window.WBdraw.trace( BrowserDetect.os);
	
	var board1= new WBdraw.WBoard("BASE_main","#ccc");
	WBdraw.currentBoard = board1;
	
	this.mainStage.addChild(board1);
	//var wbcvs = new WBoard("BASE_main","#ccc");
	//wbcvs.init(wbcvs);
	//var shape = new FormLine("rcolvi_", "free")

}
	
	function tick(event){
		var board1=mainStage.getChildByName("BASE_main");
		if (board1.width != mainStage.canvas.width || board1.height != mainStage.canvas.height){
			board1.setSize(mainStage.canvas.width,mainStage.canvas.height, '#CCC');
			console.log("abc tick  width:"+board1.width+"  widthCvs:"+ mainStage.canvas.width+"  height:"+board1.height+"  heightCvs:"+mainStage.canvas.height)
			
			initSIZE(mainStage);
		}
		mainStage.update();		
	}
	/*mainly for mobile fixed size*/
	function initSIZE(stage){
		var canvas = stage.canvas;
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
	}

/**
* Expose class.
*/
scope.Main = Main;

}(window));
