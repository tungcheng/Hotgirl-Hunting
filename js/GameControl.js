// control every scenes
var GameControl = (function () {
  
    var self;
    var gameModel;
    var gameState;
    var gameView;
    
    var STATE_RUN = 1;
    var STATE_PAUSE = 2;
    
    var intervalID;
    var ups; // updates per second

    return {
        isInit: false,
        init: function(gameCtn) {
            console.log('init gameControl');
            self = this;
            ups = 60;
            gameView = gameCtn;
            gameView.init();
            this.isInit = true;
        },
        
        newGame: function() {
            gameView.start();
            self.start();
        },
        
        start: function() {
            gameState = STATE_RUN;
            if(intervalID) {
                clearInterval(intervalID);
            }
            intervalID = setInterval(self.update, 1000/ups);
        },
        
        update: function() {
            if(gameState === STATE_RUN) {
                gameView.updateRun();
            }
            else if(gameState === STATE_PAUSE) {
                
            }
        },
        
        pauseUnpauseGame: function() {
            if(gameState === STATE_RUN) {
                gameState = STATE_PAUSE;
                gameView.pause();
            }
            else if(gameState === STATE_PAUSE) {
                gameView.unpause();
                gameState = STATE_RUN;
            }
        },
        
        stopGame: function() {
        },
        
        winGame: function() {
        },
        
        loseGame: function() {
        },
        
        drawGame: function() {
        }
    };
 
})();
