(function () {
    var self;
    CAAT.MenuInGameCtn = function(){		
        CAAT.MenuInGameCtn.superclass.constructor.call(this);
        self = this;
        return(this);
    };
    CAAT.MenuInGameCtn.prototype = {		
        init: function () {
            var director = MainControl.getDirector();
            this.setBounds(0,0,director.width,director.height);
            var CANVAS_WIDTH = director.width;
            var CANVAS_HEIGHT = director.height;

            this.greyActor = new CAAT.Foundation.Actor().setBounds(0,0,this.width,this.height)
                    .setAlpha(0.7).setFillStyle("#000");
            this.addChild(this.greyActor);

            var menuListWidth = 220;
            var menuListHeight = 50;
            this.menuListButton = [];
            var menuListImage = new CAAT.Foundation.SpriteImage()
                    .initialize(director.getImage("menuListButton"), 5, 2 );
            for(var i=0;i<5;i++){

                self.menuListButton[i] = new CAAT.Button()
                        .initialize(this.director,menuListImage,i*2,i*2+1,i*2+1,i*2,
                function(){
                },
                function(){
                },
                function(button,ex,ey){
                    var index = self.menuListButton.indexOf(this);
                    if(!button.AABB.contains(ex,ey)) return;
                    switch(index){
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            GameControl.pauseUnpauseGame();
                            MainControl.runMenuScene();
                            break;
                        case 4:
                            if(GameControl.isPlayable()) {
                                GameControl.pauseUnpauseGame();
                            }
                            break;
                    }
                })
                .setLocation((CANVAS_WIDTH-menuListWidth)/2,(CANVAS_HEIGHT-menuListHeight*5-50)/2+ (menuListHeight+10)*i)
                .setScaleAnchored(menuListWidth/menuListImage.singleWidth,menuListHeight/menuListImage.singleHeight,0,0);
                this.addChild(self.menuListButton[i]);
            }

            return this;
        }
    };
    extend(CAAT.MenuInGameCtn, CAAT.ActorContainer);
})();
