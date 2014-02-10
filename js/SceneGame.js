(function () {
    
    var self;
    
    CAAT.SceneGameCtn = function () {
        CAAT.SceneGameCtn.superclass.constructor.call(this);
        self = this;
        return this;
    };
    
    var game;
    var menuInGame;
    
    var staticBg;
    var runBg;
    var runBgVel;

    var brickActors;
    var brickSize;
    var brickImg;
    var numBricksPerSceneWidth;
    var bricksDistance;
    var distanceCount;

    var actor;
    var girlActor;
    var censoredActor;

    var startTime;
    
    var director;
    var CANVAS_WIDTH, CANVAS_HEIGHT;
    
    
    CAAT.SceneGameCtn.prototype = {
        init: function() {
            director = MainControl.getDirector();
            CANVAS_WIDTH = director.width;
            CANVAS_HEIGHT = director.height;
            
            var menuWidth = 80;
            var menuHeight = 50;
            var controlpanelHeight = 200;
            
            var menuImage = new CAAT.Foundation.SpriteImage().initialize(director.getImage('menuBattleButton'), 1, 2 );
            
            var menuFunction = function(){
                GameControl.pauseUnpauseGame();
            };
            var menuButton = new CAAT.Button().initialize(director,menuImage,0,1,1,0,menuFunction)
                .setLocation((CANVAS_WIDTH-menuWidth-20),0)
                .setScaleAnchored(menuWidth/menuImage.singleWidth,menuHeight/menuImage.singleHeight,0,0);

            this.setBounds(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
                .setFillStyle("#ccccff");
            
            game = new CAAT.ActorContainer()
                .setBounds(0, 0, this.width*2, this.height-controlpanelHeight);
            runBg = new CAAT.ActorContainer()
                .setBounds(0, 0, this.width*2, this.height-controlpanelHeight)
            	.enableEvents(false);
            game.addChild(runBg);

            var bgImg = director.getImage("background-1");
            var bgActor1 = new CAAT.ActorContainer()
                .setBounds(0, 0, this.width, this.height-controlpanelHeight)
                .setBackgroundImage(bgImg)
            	.setScaleAnchored(this.width/bgImg.width, (this.height-controlpanelHeight)/bgImg.height, 0, 0)
            	.enableEvents(false);

            bgImg = director.getImage("background-1");
            var bgActor2 = new CAAT.ActorContainer()
                .setBounds(this.width, 0, this.width, this.height-controlpanelHeight)
                .setBackgroundImage(bgImg)
            	.setScaleAnchored(this.width/bgImg.width, (this.height-controlpanelHeight)/bgImg.height, 0, 0)
            	.enableEvents(false);
            runBg.addChild(bgActor1);
            runBg.addChild(bgActor2);

            staticBg = new CAAT.ActorContainer()
                .setBounds(0, 0, this.width, this.height-controlpanelHeight)
            	.enableEvents(false);
            game.addChild(staticBg);
            
            girlActor = new CAAT.GirlActor()
                .create(director);
            
            staticBg.addChild(girlActor);

            var controlPanel = new CAAT.ActorContainer()
                .setBounds(0, this.height-controlpanelHeight,this.width,this.height)
                .setFillStyle("blue")
                .enableEvents(true);

            this.addChild(controlPanel);
            game.addChild(menuButton);
            this.addChild(game);
            
            menuInGame = new CAAT.MenuInGameCtn();
            menuInGame.init();
            this.addChild(menuInGame);
            
            brickSize = 50;
            brickImg = director.getImage('brick');
            
            numBricksPerSceneWidth = 3;
            bricksDistance = self.width/numBricksPerSceneWidth;
        },

        start: function () {
            runBgVel = 4;
            runBg.setLocation(0, 0);
            this.setZOrder(menuInGame, 0);
            
            for(var i in brickActors) {
                var brick = brickActors[i];
                runBg.removeChild(brick);
            }
            brickActors = [];
            distanceCount = bricksDistance;
            
            girlActor.start( 600, 175 );
        },
        
        updateRun: function() {
            if(Math.abs(distanceCount - bricksDistance) <= runBgVel) {
                addBrick();
                distanceCount = 0;
            }
            distanceCount += runBgVel;
            
            for(var i in brickActors) {
                var brick = brickActors[i];
                if(brick.x + brickSize <= (-1)*runBg.x) {
                    removeBrick(brick, i);
                    break;
                }
            }
            
            runBg.x -= runBgVel;
            if(runBg.x + self.width <= 0) {
                runBg.x += self.width;
                for(var i in brickActors) {
                    var brick = brickActors[i];
                    brick.x -= self.width;
                }
            }
        },
        
        pause: function() {
            //game.cacheAsBitmap();
            game.cacheAsBitmap(0, CAAT.Foundation.Actor.CACHE_DEEP);
            this.setZOrder(menuInGame, Number.MAX_VALUE);
        },
        
        unpause: function() {
            game.stopCacheAsBitmap();
            this.setZOrder(menuInGame, 0);
        }
        
    };
    
    var addBrick = function() {
        var ranNum = Math.random();
        ranNum = (ranNum >= 0.5) ? 1 : 0;
        var brick = new CAAT.Actor()
            .setBackgroundImage(brickImg)
            .setScaleAnchored(brickSize/brickImg.width, brickSize/brickImg.height, 0, 0)
            .enableEvents(false);
        if(ranNum === 1) {
            brick.setLocation((-1)*runBg.x+self.width, runBg.height - 1.5*brickSize);
        }
        else {
            brick.setLocation((-1)*runBg.x+self.width, runBg.height - 2.8*brickSize);
        }
        brick.lineOnPath = ranNum;
        brickActors.push(brick);
        runBg.addChild(brick);
    };
    
    var removeBrick = function(brick, index) {
        brickActors.splice(index, 1);
        runBg.removeChild(brick);
    };
    
    var r0 = new CAAT.Rectangle();
    var r1 = new CAAT.Rectangle();
    // e0, e1: CAAT.Actors
    var checkActorCollision = function (e0, e1) {
        r0.setBounds( e0.AABB.x, e0.AABB.y, e0.AABB.width, e0.AABB.height );
        r1.setBounds( e1.AABB.x, e1.AABB.y, e1.AABB.width, e1.AABB.height );
        return r0.intersects(r1);
    };
    
    extend(CAAT.SceneGameCtn, CAAT.ActorContainer);
})();