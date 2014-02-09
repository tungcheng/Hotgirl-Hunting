(function() {
    
    var self;
    
    CAAT.VBackGround = function() {
        CAAT.VBackGround.superclass.constructor.call(this);
        self = this;
        return (this);
    };

    CAAT.VBackGround.prototype = {

        create : function(director) {
            
            return this;
        },

        reset : function() {
            
        }
    };

    extend(CAAT.VBackGround, CAAT.ActorContainer);

})();