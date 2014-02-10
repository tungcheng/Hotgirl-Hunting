(function () {
    
    var self;
    
    CAAT.SceneGameCtn = function () {
        CAAT.SceneGameCtn.superclass.constructor.call(this);
        self = this;
        return this;
    };
    
    var game;
    var menuInGame;
    var girlText;
    var girlScore;
    
    var staticBg;
    var runBg;
    var runBgVel;
    var runBgStartVel;

    var brickActors;
    var brickSize;
    var brickImg;
    var numBricksPerSceneWidth;
    var bricksDistance;
    var distanceCount;

    var playActor;
    var girlActor;
    var censoredActor;
    var line0y, line1y;

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
            playActor = new CAAT.PlayActor()
                .create(director);
            
            staticBg.addChild(girlActor);
            staticBg.addChild(playActor);

            var controlPanel = new CAAT.ActorContainer()
                .setBounds(0, this.height-controlpanelHeight,this.width,this.height)
                .setFillStyle("blue")
                .enableEvents(true);

            this.addChild(controlPanel);
            game.addChild(menuButton);
            this.addChild(game);
            
            var font= "24px sans-serif";
            girlScore = 0;
            girlText = new CAAT.Foundation.UI.TextActor()
                .setFont(font)
                .setText("You hunted down: " + girlScore + " hotgirl (y)")
                .setAlign("left")
                .setTextFillStyle('red')
                .setOutline(true)
                .setOutlineColor('black');
            game.addChild(girlText.setLocation(0, 0));
            
            menuInGame = new CAAT.MenuInGameCtn();
            menuInGame.init();
            this.addChild(menuInGame);
            
            brickSize = 50;
            brickImg = director.getImage('brick');
            line0y = runBg.height - 1.5*brickSize + brickSize;
            line1y = runBg.height - 2.8*brickSize + brickSize;
            
            numBricksPerSceneWidth = 3;
            bricksDistance = self.width/numBricksPerSceneWidth;
            
            game.mouseDown = function(e) {
                playActor.changeLine();
            };
        },

        start: function (startVel) {
            girlScore = 0;
            girlText.setText("You hunted down: " + girlScore + " hotgirl (y)");
            runBgStartVel = startVel || 6;
            runBgVel = runBgStartVel;
            runBg.setLocation(0, 0);
            this.setZOrder(menuInGame, 0);
            
            for(var i in brickActors) {
                var brick = brickActors[i];
                runBg.removeChild(brick);
            }
            brickActors = [];
            distanceCount = bricksDistance;
            
            girlActor.start(600, 175);
            playActor.start(0.3, 100, 0, line0y, line1y);
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
            
            for(var i in brickActors) {
                var brick = brickActors[i];
                if((brick.lineOnPath === playActor.getCurLine()) &&
                        checkActorCollision(playActor, brick)) {
                    playActor.dead();
                    GameControl.loseGame();
                }
            }
            
            if(checkActorCollision(playActor, girlActor)) {
                addGirlScore();
                newRound();
            }
            
            runBg.x -= runBgVel;
            if(runBg.x + self.width <= 0) {
                runBg.x += self.width;
                for(var i in brickActors) {
                    var brick = brickActors[i];
                    brick.x -= self.width;
                }
            }
            playActor.x += playActor.velocity;
        },
        
        pause: function() {
            //game.cacheAsBitmap();
            game.cacheAsBitmap(game.time, CAAT.Foundation.Actor.CACHE_DEEP);
            this.setZOrder(menuInGame, Number.MAX_VALUE);
        },
        
        unpause: function() {
            game.stopCacheAsBitmap();
            this.setZOrder(menuInGame, 0);
        },
        
        lose : function() {
            this.setZOrder(menuInGame, Number.MAX_VALUE);
        }, 
        
        incBgSpeed : function(multi) {
            runBgVel *= multi;
            console.log(runBgVel);
        }
        
    };
    
    var addGirlScore = function() {
        girlScore++;
        girlText.setText("You hunted down: " + girlScore + " hotgirl (y)");
    };
    
    var newRound = function() {
        runBgVel = runBgStartVel;
        for(var i in brickActors) {
            var brick = brickActors[i];
            runBg.removeChild(brick);
        }
        brickActors = [];
        distanceCount = bricksDistance;
        
        playActor.start(0.3, 100, 0, line0y, line1y);
    };
    
    var addBrick = function() {
        var ranNum = Math.random();
        ranNum = (ranNum >= 0.5) ? 1 : 0;
        var brick = new CAAT.Actor()
            .setBackgroundImage(brickImg)
            .setScaleAnchored(brickSize/brickImg.width, brickSize/brickImg.height, 0, 0)
            .enableEvents(false);
        if(ranNum === 1) {
            brick.setLocation((-1)*runBg.x+self.width, line1y - brickSize);
        }
        else {
            brick.setLocation((-1)*runBg.x+self.width, line0y - brickSize);
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
        r0.setBounds( e0.AABB.x+20, e0.AABB.y, e0.AABB.width-20, e0.AABB.height );
        r1.setBounds( e1.AABB.x+20, e1.AABB.y, e1.AABB.width-20, e1.AABB.height );
        return r0.intersects(r1);
    };
    
    extend(CAAT.SceneGameCtn, CAAT.ActorContainer);
})();