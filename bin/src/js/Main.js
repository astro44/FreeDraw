/** @define {string} */
var BUILD = "debug";

(function(scope){

function Main(){}

Main.main = function(){
	var main = new Main();
	main.initialize();
}

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
	
	
	var stats = new Stats();
	var stats1 = new Stats();
	var stats2 = new Stats();
	stats.setMode( 0 )
	stats1.setMode( 1 )
	stats2.setMode( 2 )
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.bottom = '10px';
	document.body.appendChild( stats.domElement );
	window.stats=stats;
	stats1.domElement.style.position = 'absolute';
	stats1.domElement.style.left = '90px';
	stats1.domElement.style.bottom = '10px';
	document.body.appendChild( stats1.domElement );
	window.stats1=stats1;
	stats2.domElement.style.position = 'absolute';
	stats2.domElement.style.left = '180px';
	stats2.domElement.style.bottom = '10px';
	document.body.appendChild( stats2.domElement );
	window.stats2=stats2;
	//this.window.meter=meter;
	/*
	* createjs
	*/
	createjs.Ticker.addEventListener("tick", this.mainStage);
	//createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.setFPS(60);
	
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

}
	
	function tick(event){
		var board1=mainStage.getChildByName("BASE_main");
		
		window.stats.begin();
		window.stats1.begin();
		window.stats2.begin();
		if (board1.width != mainStage.canvas.width || board1.height != mainStage.canvas.height){
			board1.setSize(mainStage.canvas.width,mainStage.canvas.height, '#CCC');
			console.log("abc tick  width:"+board1.width+"  widthCvs:"+ mainStage.canvas.width+"  height:"+board1.height+"  heightCvs:"+mainStage.canvas.height)
			
			initSIZE(mainStage);
		}
		//mainStage.update();		
		
		window.stats.end();
		window.stats1.end();
		window.stats2.end();
	}
	/*primarily mobile fixed size*/
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


scope.Main = Main;

}(window));
