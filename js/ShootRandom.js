this.cutie = this.cutie || {};
this.cutie.Behavior = this.cutie.Behavior || {};

(function(module){
    var ShootRandom = function(props) {
        // ================================================
        // VARIABLE DECLARATIONS
        // ================================================
        var props = props || {};
        var o = {};
        var projectile = {};
        var enemies = [];
        var testPairs = [];
        var isShoot = true;

        // ================================================
        // PUBLIC METHODS
        // ================================================
        this.init = function(obj) {
            o = obj;
            projectile = props.projectile;
            enemies = props.enemies;
            setInterval(shoot, 200);
        };


        this.tick = function(obj) {
            for (var i = testPairs.length - 1; i >= 0; i--) {
                var pair = testPairs[i];                
                if (hitTest(pair[0], pair[1])) {
                    testPairs.splice(i, 1);
                    cutie.getActiveScene().removeChild(pair[1]);
                    pair[0].health -= o.attack;
                    if (pair[0].health <= 0) {
                        cutie.getActiveScene().deleteFighter(pair[0]);
                    }
                }
            }
        }

        this.clean = function() {
            console.log('CLEAN');
            isShoot = false;
            for (var i = 0; i < testPairs.length; i++) {
                cutie.getActiveScene().removeChild(testPairs[i][1]);
            }
            testPairs = [];
        }

        function hitTest(o1, o2) {
            return cutie.Util.distance(o1, o2) < 30;
        }

        function shoot() {
            if (!isShoot || Math.random() < 0.7 || enemies.length <= 1)
                return;
            var enemy = null;
            while (!enemy || enemy == o) {
                enemy = enemies[Math.floor(Math.random() * enemies.length)];
            }

            shootThing(enemy);
        }

        function shootThing(enemy) {
            if (!enemy)
                return;
            var proj = new cutie.Bitmap(projectile);
            proj.x = o.x;
            proj.y = o.y;
            proj.scaleX = proj.scaleY = 0.05;
            cutie.getActiveScene().addChild(proj);
            proj.addBehavior(new cutie.Behavior.Follow({'targetObj': enemy, 'speed': 200}));
            var a = [];
            a.push(enemy);
            a.push(proj);
            testPairs.push(a);
        }
    }

    module.ShootRandom = ShootRandom;
})(this.cutie.Behavior);
