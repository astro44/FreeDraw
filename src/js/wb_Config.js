/**
 * ...
 */

(function(scope) {
 'use strict'; 
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
	
	var p = ConfigWB.prototype = {
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

			}
		},
	
		toString: function() {
			return "[Config.ConfigWB]";
		}
		
	}
	
	scope.ConfigWB = ConfigWB;
}(window.WBdraw));