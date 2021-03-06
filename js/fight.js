var storageData = [];
var thumbnails = [];
var DATA_URL = 'http://netfight-img.herokuapp.com/?url=';
var fighters = [];

$(document).ready(function() {
    $('#js-canvas').attr('width', window.innerWidth);
    $('#js-canvas').attr('height', window.innerHeight);

     // Set the log level
    cutie.Log.level = cutie.Log.VERBOSE;

    // Get data from storage, then kick-off the game
    chrome.storage.local.get('netfight', function(obj) {
        storageData = obj['netfight'];

        async.map(storageData, getBase64, function(err, results){
            thumbnails = results;
            cutie.start("fight");
        });
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
        loader.loadFile({
            'id': 'astronaut_helmet',
            'src': 'img/astronaut_helmet.png'
        });
        loader.loadFile({
            'id': 'astronaut_helmet_projectile',
            'src': 'img/astronaut_helmet_projectile.png'
        });
        loader.loadFile({
            'id': 'guy_fawkes',
            'src': 'img/guy_fawkes.png'
        });
        loader.loadFile({
            'id': 'guy_fawkes_projectile',
            'src': 'img/guy_fawkes_projectile.png'
        });
        loader.loadFile({
            'id': 'jason_mask',
            'src': 'img/jason_mask.png'
        });
        loader.loadFile({
            'id': 'jason_mask_projectile',
            'src': 'img/jason_mask_projectile.png'
        });
        loader.loadFile({
            'id': 'jester_hat',
            'src': 'img/jester_hat.png'
        });
        loader.loadFile({
            'id': 'jester_hat_projectile',
            'src': 'img/jester_hat_projectile.png'
        });
        loader.loadFile({
            'id': 'mickey_ears',
            'src': 'img/mickey_ears.png'
        });
        loader.loadFile({
            'id': 'mickey_ears_projectile',
            'src': 'img/mickey_ears_projectile.png'
        });
        loader.loadFile({
            'id': 'pope_hat',
            'src': 'img/pope_hat.png'
        });
        loader.loadFile({
            'id': 'pope_hat_projectile',
            'src': 'img/pope_hat_projectile.png'
        });
        loader.loadFile({
            'id': 'saiyan_hair',
            'src': 'img/saiyan_hair.png'
        });
        loader.loadFile({
            'id': 'saiyan_hair_projectile',
            'src': 'img/saiyan_hair_projectile.png'
        });
        loader.loadFile({
            'id': 'wizard_hat',
            'src': 'img/wizard_hat.png'
        });
        loader.loadFile({
            'id': 'wizard_hat_projectile',
            'src': 'img/wizard_hat_projectile.png'
        });
        loader.loadFile({
            'id': 'wolverine',
            'src': 'img/wolverine.png'
        });
        loader.loadFile({
            'id': 'wolverine_projectile',
            'src': 'img/wolverine_projectile.png'
        });
    }

    scene.init = function(preloaded) {
        cutie.Log.d('title.init()');

        // Create fighters
        var cx = cutie.WIDTH/2;   
        var cy = cutie.HEIGHT/2;
        var angleOffset = (Math.PI * 2) / thumbnails.length;
        var angle = angleOffset / 2;
        var radius = cutie.HEIGHT/4;
        for (var i = 0; i < thumbnails.length; i++) {
            var f = makeFighter(preloaded, thumbnails[i], null, storageData[i].metacritic, storageData[i].imdb);
            f.x = Math.cos(angle) * radius + cx;
            f.y = Math.sin(angle) * radius + cy;
            f.id = storageData[i].id;
            angle += angleOffset;
            fighters.push(f);
            f.addBehavior(new cutie.Behavior.Jump());
            f.addBehavior(new cutie.Behavior.ShootRandom({
                'projectile': preloaded.getResult('wizard_hat_projectile'),
                'enemies': fighters
            }));
            this.addChild(f);
        }
    }

    function makeFighter(preloaded, thumbnail, addonId, health, attack) {
        var bitmap = new cutie.Bitmap(thumbnail);
        bitmap.regX = bitmap.image.width/2;
        bitmap.regY = bitmap.image.height/2;
        bitmap.scaleX = bitmap.scaleY = 0.4;

        bitmap.health = health || 10;
        bitmap.attack = attack || 1;

        return bitmap;
    }

    scene.deleteFighter = function(fighter) {
        if (fighters.length == 1) {
            return;
        }
        for (var i = 0; i < fighter.behaviors.length; i++) {
            fighter.behaviors[i].clean();
        }
        console.log(fighter.behaviors);
        for (var i = fighters.length - 1; i >= 0; i--) {
            if (fighters[i] == fighter) {
                fighters.splice(i, 1);
                cutie.getActiveScene().removeChild(fighter);
                break;
            }
        }

        if (fighters.length == 1) {
            gameOver();
        }
    }

    function gameOver() {
        console.log('Game Over');
        for (var i = storageData.length - 1; i >= 0; i--) {
            if (storageData[i].id != fighters[0].id)
                storageData.splice(i, 1);
        }
        chrome.storage.local.set({ 'netfight': storageData });
        console.log(chrome.extension.getURL('netfight.html'));
        window.location.href = chrome.extension.getURL('netfight.html') + '#winner';
    }

    cutie.registerScene(scene, 'fight');
})();


function getBase64(o, callback) {
    var url = DATA_URL + o.img;
    $.get(url, function(results) {
        var image = new Image();
        image.src = results;
        callback(null, image);
    });
}
