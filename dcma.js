(function () {
    'use strict'
	
Lampa.Platform.tv();

    //Lampa settings
    window.lampa_settings = window.lampa_settings || {}
    window.lampa_settings.dcma = false
    window.lampa_settings.disable_features = window.lampa_settings.disable_features || {}
    window.lampa_settings.disable_features.dmca = true

})()