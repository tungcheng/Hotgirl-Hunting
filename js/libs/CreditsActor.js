(function () {
    CAAT.CreditsActor = function () {
        CAAT.CreditsActor.superclass.constructor.call(this);
        return this;
    }

    CAAT.CreditsActor.prototype = {
        director: null,
        credits: null,
        currentCredit: null,
        numberCredits: null,
        fn: null,
        initialize: function (director, credits, fn) {
            var self = this;
            this.director = director;
            this.credits = credits;
            this.currentCredit = 0;
            this.numberCredits = credits.length;
            this.fn = fn;
            this.setBackgroundImage(director.getImage("credits_bg"));
            this.sceneTime = 0;
            var fadeBehavior = new CAAT.AlphaBehavior().setValues(0, 1).setFrameTime(this.sceneTime, 500).
                addListener({
                    behaviorExpired: function (behavior, time, actor) {
                        actor.emptyBehaviorList();
                        
                        var textActor = new CAAT.MyTextActor().initialize(director, credits[0], 350);
                        textActor.setTextFillStyle("rgb(255, 223, 167)");
                        textActor.setHorizontalAlign("left");
                        textActor.setFontSize(20);
                        textActor.setLineHeight(25);
                        textActor.setPosition(120, 100);

                        var behavior = new CAAT.AlphaBehavior().setValues(0, 1).setPingPong().setFrameTime(time, 3000).
                            addListener({
                                behaviorExpired: function (behavior, time, actor) {
                                    self.currentCredit++;
                                    if (self.currentCredit < self.numberCredits) {
                                        actor.setText(credits[self.currentCredit]);
                                        behavior.setFrameTime(time, 3000);
                                        actor.addBehavior(behavior);
                                    } else {
                                        self.actionComplete();
                                        actor.emptyBehaviorList();
                                    }
                                }
                            });
                        textActor.addBehavior(behavior);

                        var img = new CAAT.SpriteImage().initialize(director.getImage("cancelButton"), 1, 1);
                        var cancelButton = new CAAT.Button().initialize(director, img, 0, 0, 0, 0, function () {
                            textActor.emptyBehaviorList();
                            self.actionComplete();
                        });
                        cancelButton.setPosition(400, 250);

                        self.addChild(textActor);
                        self.addChild(cancelButton);
                    }
                })
            this.addBehavior(fadeBehavior);

            
            return this;
        },
        paint: function(director,time){
            CAAT.CreditsActor.superclass.paint.call(this, director, time);
            this.sceneTime = time;
        },
        setFn: function(fn) {
            this.fn = fn;
        },

        actionComplete: function () {
            if (this.fn) {
                this.fn();
            }
            return;
        }
    }
    extend(CAAT.CreditsActor, CAAT.ActorContainer);
})();