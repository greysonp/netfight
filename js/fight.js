var storageData = [];

$(document).ready(function() {
    $('#js-canvas').attr('width', window.innerWidth);
    $('#js-canvas').attr('height', window.innerHeight);

     // Set the log level
    cutie.Log.level = cutie.Log.VERBOSE;

    // Get data from storage, then kick-off the game
    chrome.storage.local.get('netfight', function(obj) {
        storageData = obj['netfight'];
        cutie.start("fight");
    });
}); 

$(window).resize(function() {
    $('#js-canvas').attr('width', window.innerWidth);
    $('#js-canvas').attr('height', window.innerHeight);
    cutie.WIDTH = window.innerWidth;
    cutie.HEIGHT = window.innerHeight;
});


(function() {
    var scene = new cutie.Scene();

    scene.preload = function(loader) {
        // Thumbnails
        for (var i = 0; i < storageData.length; i++) {
            var o = storageData[i];
            loader.loadFile({
                'id': o.id,
                'src': o.img
            });
        }

        // Extras
        loader.loadFile({
            'id': 'astronaut_helmet',
            'src': 'img/astronaut_helmet.png'
        });
        loader.loadFile({
            'id': 'guy_fawkes',
            'src': 'img/guy_fawkes.png'
        });
        loader.loadFile({
            'id': 'jason_mask',
            'src': 'img/jason_mask.png'
        });
        loader.loadFile({
            'id': 'jester_hat',
            'src': 'img/jester_hat.png'
        });
        loader.loadFile({
            'id': 'mickey_hat',
            'src': 'img/mickey_hat.png'
        });
        loader.loadFile({
            'id': 'pope_hat',
            'src': 'img/pope_hat.png'
        });
        loader.loadFile({
            'id': 'saiyan_hair',
            'src': 'img/saiyan_hair.png'
        });
        loader.loadFile({
            'id': 'wizard_hat',
            'src': 'img/wizard_hat.png'
        });
        loader.loadFile({
            'id': 'wolverine',
            'src': 'img/wolverine.png'
        });
    }

    scene.init = function(preloaded) {
        cutie.Log.d('title.init()');
        
        for (var i = 0; i < storageData.length; i++) {
            var o = storageData[i];
            var f = makeFighter(preloaded, o.id, null);
            f.x = Math.random() * cutie.WIDTH;
            f.y = Math.random() * cutie.HEIGHT;
            this.addChild(f);
        }
    }

    function makeFighter(preloaded, thumbnailId, addonId) {
        var bitmap = new cutie.Bitmap(preloaded.getResult(thumbnailId));
        return bitmap;
    }

    cutie.registerScene(scene, 'fight');
})();