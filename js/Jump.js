this.cutie = this.cutie || {};
this.cutie.Behavior = this.cutie.Behavior || {};

(function(module){
    var Jump = function(props) {
        // ================================================
        // VARIABLE DECLARATIONS
        // ================================================
        var props = props || {};
        var o = {};
        var hopping = true;

        // ================================================
        // PUBLIC METHODS
        // ================================================
        this.init = function(obj) {
            o = obj;
            hop();
        };


        this.tick = function(obj) {

        }

        this.clean = function() {
            hopping = false;
        }

        function hop() {
            var padding = 50;
            var rad = 10;
            var angle = Math.random() * (Math.PI * 2);
            if (o.y < padding) {
                angle = Math.PI / 2;

            }
            else if (o.y > cutie.HEIGHT - padding) {
                angle = (Math.PI * 3) / 2;
            }
            else if (o.x < padding) {
                angle = 0;
            }
            else if (o.x > cutie.WIDTH - padding) {
                angle = Math.PI;
            }

            var rx = Math.cos(angle) * rad + o.x;
            var ry = Math.sin(angle) * rad + o.y;

            if (hopping)
                createjs.Tween.get(o).to({'x': rx, 'y': ry}, 100).call(hop);
        }
    }

    module.Jump = Jump;
})(this.cutie.Behavior);
