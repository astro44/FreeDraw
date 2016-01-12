(function(scope) {

	function resizeBtn(id, color,invoke) {
		this.Container_constructor();
		this.method=invoke
		this.color = color;
		this.name=this.id=id;
		this.type="btn";
		this.width=0;
		this.height=0;
		
		this.setup();
	}
	var p = createjs.extend(resizeBtn, createjs.Container);


	p.setup = function() {
		
		this.width = 30;
		this.height = 30;
		
		
		var background = new createjs.Shape();
		
		background.graphics.beginStroke("#000");
		background.graphics.beginFill(this.color).drawCircle(0,0,10);
		
		this.addChild(background); 
		this.on("click", this.handleClick);
		this.on("mousedown", this.handlePress);
		this.on("rollover", this.handleRollOver);
		this.on("rollout", this.handleRollOver);
		this.cursor = "pointer";

		this.mouseChildren = false;
		
		this.offset = Math.random()*10;
		this.count = 0;
	} ;
	
	
	p.handlePress = function(event){ 
		event.stopImmediatePropagation();
	};

	p.handleClick = function (event) {
		//alert("You clicked on a button: "+this.label);
		this.method(this,this.id)
		event.stopImmediatePropagation();
	} ;

	p.handleRollOver = function(event) {       
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	};

	scope.resizeBtn = createjs.promote(resizeBtn, "Container");
}(window.WBdraw));