
// control every scenes
var MainControl = (function () {
  
    var createCanvas = function () {
        var canvas = document.getElementById("root-canvas");
        if (!canvas) {
            canvas = document.createElement ("canvas");
            canvas.setAttribute ("id", "root-canvas");
            canvas.setAttribute ("width", "800");
            canvas.setAttribute ("height", "600");
        }
        CANVAS_WIDTH = canvas.width;
        CANVAS_HEIGHT = canvas.height;
        return canvas;
    };

    var onResizeCallback = function( director, newWidth, newHeight ){
        var cwch=CANVAS_WIDTH/CANVAS_HEIGHT;
        var minheight=400;
        var minwidth=minheight*cwch;
        if (newWidth<=minwidth||newHeight<=minheight){
            director.setScaleProportional(minwidth, minheight);
        }
        CANVAS_WIDTH = newWidth;
        CANVAS_HEIGHT = newHeight;
    };

    var switchScene = function(index) {
        director.switchToScene(index);
    };

    var self;
    var director;
    var CANVAS_WIDTH, CANVAS_HEIGHT;
    var sceneLoad, sceneLoadCtn;
    var sceneMenu, sceneMenuCtn;
    var sceneGame, sceneGameCtn;

    return {

        init: function() {
            self = this;
            var canvas = createCanvas ();
            var gamewrapper = document.getElementById ("game-wrapper");
            gamewrapper.appendChild (canvas);
            
            CAAT.DEBUG = 1;
            director = new CAAT.Foundation.Director().initialize(800, 600, canvas);
            director.enableResizeEvents(CAAT.Foundation.Director.RESIZE_PROPORTIONAL,onResizeCallback );

            //scene 0
            sceneLoad = director.createScene();
            sceneLoadCtn = new CAAT.SceneLoadCtn();
            sceneLoad.addChild(sceneLoadCtn);
            
            //scene 1
            sceneMenu = director.createScene();
            sceneMenuCtn = new CAAT.SceneMenuCtn();
            sceneMenu.addChild(sceneMenuCtn);
            
            //scene 2
            sceneGame = director.createScene();
            sceneGameCtn = new CAAT.SceneGameCtn();
            sceneGame.addChild(sceneGameCtn);
            
            this.runLoadScene();
            CAAT.loop(60);
        },
        
        getDirector: function() {
            return director;
        },

        runLoadScene: function() {
            console.log("start load");
            sceneLoadCtn.start();
            switchScene(0);
        },

        afterLoadScene: function(images, audios) {
            console.log("load done");
            director.setImagesCache(images);
            this.runMenuScene();
        }, 
        
        runMenuScene: function() {
            if(!sceneMenuCtn.isInit) {
                sceneMenuCtn.init();
            }
            switchScene(1);
        },
        
        newGame: function() {
            if(!GameControl.isInit) {
                GameControl.init(sceneGameCtn);
            }
            GameControl.newGame();
            switchScene(2);
        }
    };
 
})();