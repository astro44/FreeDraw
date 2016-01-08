/** @define {string} */
var BUILD = "debug";

(function(){

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
	
	console.log("main...start");
	
	var wbcvs = new CanvasContainer("BASE_main","#ccc");
	//var shape = new FormLine("rcolvi_", "free")

	this.mainStage.addChild(wbcvs);
}
	
	function tick(event){
		var wbcvs=mainStage.getChildByName("BASE_main");
		if (wbcvs.width != mainStage.canvas.width){
			wbcvs.setSize(mainStage.canvas.width,mainStage.canvas.height, '#CCC')
		}
		mainStage.update();		
	}

/**
* Expose class.
*/
window.Main = Main;

})();
