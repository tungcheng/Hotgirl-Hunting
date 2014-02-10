(function() {

    CAAT.GirlActor = function() {
        CAAT.GirlActor.superclass.constructor.call(this);
        return (this);
    };

    var spriteGirl;

    CAAT.GirlActor.prototype = {

        create : function(director) {

            var reset = function(spriteImage, time) {
                spriteImage.playAnimation("run");
            };

            spriteGirl = new CAAT.Foundation.SpriteImage()
                .initialize(director.getImage("girl"), 4, 4)
                .addAnimation("run",   [0,1,2, 3,4,5,6,7,8,9, 10,11,12,13,14,15], 50, reset);

            this.setBackgroundImage(spriteGirl)
                .setScale(1.55,1.55);
            return this;
        },

        start : function(x, y) {
            this.playAnimation("run");
            this.setLocation(x, y);
            return this;  
        }
    };

    extend(CAAT.GirlActor, CAAT.Actor);

})();