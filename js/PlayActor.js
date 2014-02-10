(function() {
    var self;
    
    CAAT.PlayActor = function() {
        CAAT.PlayActor.superclass.constructor.call(this);
        self = this;
        return (this);
    };
    
    var spriteDude;
    
    var curLine;
    var line0y, line1y;
    var isDead;

    CAAT.PlayActor.prototype = {
        
        create : function(director) {

            var reset = function(spriteImage, time) {
                spriteImage.playAnimation("run");
            };

            spriteDude = new CAAT.Foundation.SpriteImage().
                initialize(director.getImage("dude"), 21, 7).
                addAnimation("stand",   [123,124,125, 126,127,128,129,130,131,132, 133,134,135,136,137,138,139, 140,141,142,143,144], 100).
                addAnimation("fall",    [0,1,2,3,4,5,6,7], 100, reset).
                addAnimation("wall_ud", [74,75,76, 77,78,79,80,81], 100).
                addAnimation("wall_lr", [82,83, 84,85,86,87,88,89], 100).
                addAnimation("tidy",    [42,43,44,45,46,47,48, 49,50], 100, reset).
                addAnimation("die",     [68,69, 70,71,72,73], 100, reset).
                addAnimation("jump",    [95,94,93,92,91, 90], 100, reset).
                addAnimation("run_b",   [96,97, 98,99,100,101,102,103,104, 105,106,107,108,109,110,111, 112,113,114,115,116,117,118, 119,120,121,122], 30).
                addAnimation("run",     [122,121,120,119, 118,117,116,115,114,113,112, 111,110,109,108,107,106,105, 104,103,102,101,100,99,98, 97,96], 30).
                addAnimation("sad",     [26,27, 28,29,30,31,32,33], 100);

            this.setBackgroundImage(spriteDude)
                .setScale(0.9,0.9);

            return this;
        },

        start : function(velo, x, line, l0y, l1y) {
            curLine = line;
            line0y = l0y;
            line1y = l1y;
            var y = (line===0) ? (line0y-this.height) : (line1y-this.height);
            this.velocity = velo;
            this.setLocation(x, y);
            this.playAnimation("run");
            isDead = false;
            return this;
        }, 
        
        changeLine : function() {
            if(!isDead) {
                curLine = (curLine===0) ? 1 : 0;
                var y = (curLine===0) ? (line0y-this.height) : (line1y-this.height);
                this.setLocation(this.x, y);
            }
        },
        
        dead : function() {
            this.playAnimation("sad");
            isDead = true;
            return this;
        },
        
        getCurLine : function() {
            return curLine;
        }
    };

    extend(CAAT.PlayActor, CAAT.ActorContainer);

})();