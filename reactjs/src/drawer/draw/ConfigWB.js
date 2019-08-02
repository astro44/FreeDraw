function ConfigWB( platform, width, height) {
    this.initialize(platform, width, height);
}
var s = ConfigWB;
    // Platform ENUMs
s.PLATFORM_DESKTOP = "desktop";
s.PLATFORM_WP7 = "wp7";
s.PLATFORM_WP8 = "wp8"; // Might be fine to use WP
s.PLATFORM_IPHONE = "iPhone";
s.PLATFORM_IPHONE3 = "iPhone3";
s.PLATFORM_IPHONE_PINNED = "iPhonePinned";
s.PLATFORM_IPHONE3_PINNED = "iPhone3Pinned";

s.QUALITY_NORMAL = 0;
s.QUALITY_HIGH = 1;
s.QUALITY_LOW = 2;

ConfigWB.prototype = {
    touchEnabled: false,
    
    isIOS: false,
    width: 1024,
    height: 622,
    scaleFactor: 1,
    platform: null,
    /**
     * The  quality is determined by the rough resolution and platform, which provides an
     * idea on how much to scale assets in a game to be reasonable.
     * <ul>
     *     <li>Normal (0): This is the default, and what is shown on the desktop (1024x622)</li>
     *     <li>High (1): A device with high resolution, it is recommended to draw assets a little larger (1.5x or so).
     *      Devices with high resolution include the iPhone 4+, and Windows Phone 8 devices with 720p resolution.
     *     <li>Low (2): A device with low resolution, it is recommended to draw assets a little smaller (0.75x).
     *      Devices with low resolution include Windows Phone 7 & 8 (WVGA), and iPhone 3GS and lower.
     * </ul>
     * @property quality
     * @type Number
     * @default QUALITY_NORMAL (0)
     */
    quality: s.QUALITY_NORMAL,
    
    initialize: function( platform, width, height) {
        // Set the size if it was passed in.
        if (width != null) { this.width = width; }
        if (height != null) { this.height = height; }

        //TODO: Platform will have to be determined by the system.
        this.platform = platform;
        switch (platform) {
            case s.PLATFORM_DESKTOP:
                this.width = 1024;
                this.height = 622;
                break;

            case s.PLATFORM_WP7:
                this.width = 800;
                this.height = 410;
                this.scaleFactor = 0.6;
                this.quality = s.QUALITY_LOW;
                break;

            case s.PLATFORM_WP8:
                //TODO: Might have WVGA resolution as well, which is low-res
                this.width = 1280;
                this.height = 700;
                this.scaleFactor = 0.6;
                this.quality = s.QUALITY_HIGH;
                break;

            /* Mobile with browser chrome
            case s.PLATFORM_IPHONE:
                this.width = 960;
                this.height = 396;
                this.scaleFactor = 0.5;
                this.quality = s.QUALITY_HIGH;
                break;
            case s.PLATFORM_IPHONE3:
                this.width = 480;
                this.height = 196;
                this.quality = s.QUALITY_LOW;
                break;
            case s.PLATFORM_IPHONE3_PINNED:
                this.width = 480;
                this.height = 320;
                this.quality = s.QUALITY_LOW;
                break;
            */

            case s.PLATFORM_IPHONE:
                this.width = 960;
                this.height = 640;
                this.scaleFactor = 0.5;
                this.quality = s.QUALITY_HIGH;
                break;
            default:
        }
    },

    toString: function() {
        return "[Config.ConfigWB]";
    }
    
}

s.getContrast50 = function (hexcolor){
    return (parseInt(hexcolor.substring(1), 16) > 0xffffff/2) ? 'black':'white';
}

s.luma = function(hex/*#000000*/){
    //console.log(hex);//#61fbf1 //#88d66 //#92ae2 //#cf2f9
    var c = hex.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue
    return  0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
}

s.MidPoint= function( from, to ){
  var xs = 0;
  var ys = 0;
  xs = to.x - from.x;
  xs = xs * xs;
  ys = to.y - from.y;
  ys = ys * ys;
  return Math.sqrt( xs + ys );
}
/*
WBdraw.rotatePoint = function(cc, pp, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (pp.x - cc.x)) + (sin * (pp.y - cc.y)) + cc.x,
        ny = (cos * (pp.y - cc.y)) - (sin * (pp.x - cc.x)) + cc.y;
    return [nx, ny];
}*/

s.rotateAngle = function(from,to){
     var deltaX = to.x - from.x;
     var deltaY = to.y - from.y;
     var angleRad = Math.atan2(deltaY, deltaX); // In radians
     var angleDeg = angleRad * 180 / Math.PI;
        return angleDeg
}

s.convert2pos =function (owner,lc){
    if ((lc.x>0 && lc.y<0) || (lc.y>0 && lc.x<0)){//move 0,0 to (-lc.x,0) and lc.x,lc.y to (lc.x-lc.x,lc.y)
        //then move the reg.x and reg.y points accordingly
        console.log(owner.type)
        if (owner.type=== 'straight' || owner.type=== 'links'){
                console.log(">>>>>  +%+%+%--GOT IT HOOKED--%+%+%+%++"+owner.constructor.name +"   ::>> "+window.WBdraw.FormLine.name);
            return lc;
        }
    }
    if (lc.x<0){//moveBy in the + direction X
        lc.x=Math.abs(lc.x);
        owner.x-=lc.x;
    }
    if (lc.y<0){//moveBy in the + direction Y
        lc.y=Math.abs(lc.y);
        owner.y-=lc.y;
    }
    return lc;
}	

s.lineInterpolate =function ( owner,x2,y2, distance ){
      var xabs = Math.abs( 0 - x2 );
      var yabs = Math.abs( 0 - y2 );
      var xdiff = x2 - 0;
      var ydiff = y2 - 0;
     
      var length = Math.sqrt( ( Math.pow( xabs, 2 ) + Math.pow( yabs, 2 ) ) );
      var steps = length / distance;
      var xstep = xdiff / steps;
      var ystep = ydiff / steps;
     
      var newx = 0;
      var newy = 0;
      var result = [];
        // var a =  owner.related.to;
        // var b =  owner.related.from;
      for( var s = 0; s < steps; s++ )
      {
        newx =0 + ( xstep * s );
        newy = 0 + ( ystep * s );
     
        
        
        
        result.push( {
          x: Math.round(newx),
          y: Math.round(newy)
        } );
      }
     
      return result;
}

export default s;