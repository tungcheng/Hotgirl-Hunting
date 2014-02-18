(function () {
    
    var self;
    
    CAAT.SceneMenuCtn = function () {
        CAAT.SceneMenuCtn.superclass.constructor.call(this);
        self = this;
        return this;
    };
    
    var isLock = false;
    var enableButton = function () {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setEnabled(true);
        }
        isLock = false;
    };

    var disableButton = function () {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setEnabled(false);
        }
        isLock = true;
    };
    
    menuButtonAction = function (j) {
        var director = MainControl.getDirector();
        return function () {
            switch (j) {
                case 0:
                    MainControl.newGame();
                    break;
                case 1:
                    break;
                case 2:
                    console.log('option');
                    break;
                case 3:
                    console.log('credits');
                    disableButton();
                    var credits = [
                        "PROGRAM\n" +
                        "       Lê Việt Hà\n" + 
                        "       Nguyễn Thanh Tùng",
                        "GRAPHICS\n" +
                        "       Lê Việt Hà\n" + 
                        "       Nguyễn Thanh Tùng",
                        "CODER\n" +
                        "       Lê Việt Hà\n" + 
                        "       Nguyễn Thanh Tùng",
                        "LOGICTIC\n" +
                        "      Lê Việt Hà\n" + 
                        "      Nguyễn Thanh Tùng",
                        "MUSIC\n" +
                        "       Lê Việt Hà\n" + 
                        "       Nguyễn Thanh Tùng",
                        "       SPECIAL THANK\n\n"+
                        "       Hot girl Ai Shinozaki :v\n\n\n"+
                        "For help us complete this games!",
                        "       Bring to you by BKGM\n\n"+
                        "      THANK FOR PLAYING!"
                    ];
                    var creditActor = new CAAT.CreditsActor().initialize(director, credits);
                    creditActor.setPosition((director.width-creditActor.width)/2,100);
                    creditActor.setFn(function () {
                        enableButton();
                        self.removeChild(this);
                    });
                    self.addChild(creditActor);
                    break;
            }
        };
    };
    
    var buttons;

    CAAT.SceneMenuCtn.prototype = {

        init: function () {
            var director = MainControl.getDirector();
            buttons = [];
            this.setBackgroundImage(director.getImage("menu_bg"));
            var buttonImage = new CAAT.SpriteImage().initialize(director.getImage("menu_button"), 4, 2);
            var i = 0;
            for (i; i < 4; i++) {
                var button = new CAAT.Button().initialize(director, buttonImage, 2 * i, 2 * i + 1, 2 * i + 1);
                buttons.push(button);
                button.setActionPerformed(menuButtonAction(i));
                button.setPosition(550, 250 + i * 50);
                self.addChild(button);
            }
            self.isInit = true;
        },
        
        isInit: false
    };
    extend(CAAT.SceneMenuCtn, CAAT.ActorContainer);
})();