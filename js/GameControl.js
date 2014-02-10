// control every scenes
var GameControl = (function () {
  
    var self;
    var gameState;
    var gameView;
    
    var STATE_RUN = 1;
    var STATE_PAUSE = 2;
    var STATE_LOSE = 3;
    
    var intervalID;
    var ups; // updates per second
    var incSpeedTime;
    var count;
    var multiSpeed;

    return {
        isInit: false,
        init: function(gameCtn) {
            self = this;
            ups = 40;
            incSpeedTime = 2000;
            multiSpeed = 1.1;
            gameView = gameCtn;
            gameView.init();
            this.isInit = true;
        },
        
        newGame: function() {
            gameView.start(8);
            self.start();
        },
        
        start: function() {
            count = 0;
            gameState = STATE_RUN;
            if(intervalID) {
                clearInterval(intervalID);
            }
            intervalID = setInterval(self.update, 1000/ups);
        },
        
        update: function() {
            if(gameState === STATE_RUN) {
                gameView.updateRun();
                count += (1000/ups);
                if(count >= incSpeedTime) {
                    gameView.incBgSpeed(multiSpeed);
                    count = 0;
                }
            }
            else if(gameState === STATE_PAUSE) {
                
            }
            else if(gameState === STATE_LOSE) {
                gameView.lose();
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
            gameState = STATE_LOSE;
        },
        
        drawGame: function() {
        },
        
        isPlayable: function() {
            return (gameState === STATE_RUN || gameState === STATE_PAUSE);
        }
    };
 
})();
