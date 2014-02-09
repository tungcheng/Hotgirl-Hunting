(function() {

    var self;

    CAAT.SceneLoadCtn = function() {
        self = this;
        CAAT.SceneLoadCtn.superclass.constructor.call(this);
        return (this);
    };

    var loadedImage = 0;
    var loadedAudio = 0;
    var loadedPercent = 0;
    var loadAudios,loadImages;
    
    var load = function() {
        var audioElement = new AudioPreloader();
            //.addElement("calculator", ["sound/calculator.mp3","sound/calculator.ogg"]);

        var imageElement = new CAAT.Module.Preloader.Preloader().
                addElement("dude", "img/dude.png").
                addElement("girl", "img/hotgirl2.png").
                addElement("background-1", "img/background-1.png").
                addElement("jumbButton", "img/buttons/kim.png").
                addElement("actionButton", "img/buttons/hoa.png").
                addElement("menu_bg", "img/menu_bg.png").
                addElement("menu_bg2", "img/menu_bg2.jpg").
                addElement("menu_button", "img/buttons/menu_button2.png").
                addElement("cancelButton", "img/cancelButton.png").
                addElement("credits_bg", "img/credits_bg.png").
                addElement("menuBattleButton", "img/buttons/menuButton.png").
                addElement("menuListButton", "img/buttons/menu_battle_button.png").
                addElement("censored", "img/demoCensore.png").
                addElement("brick", "img/brickBlock.png").
                addElement("rock", "img/rock_icon.png")
            ;
        if(audioElement.elements.length === 0) loadAudios = [];
        if(imageElement.elements.length === 0) loadImages = [];
        var elementLength = audioElement.elements.length + imageElement.elements.length;
        if(elementLength === 0) {
                loadedPercent = 100;
                return;
        }
        audioElement.load (
            function loadAll(audios){
                loadAudios = audios;
            },
            function loadEach(audio){
                loadedAudio++;
                loadedPercent = Math.round((loadedAudio + loadedImage)/elementLength*100);
            }
        );
        imageElement.load(
            function onAllAssetsLoaded(images) {
                loadImages = images;
            },
            function onEachLoad(index){
                loadedImage++;
                loadedPercent = Math.round((loadedAudio + loadedImage)/elementLength*100);
            }
        );
    };

    CAAT.SceneLoadCtn.prototype = {

        start: function() {
            var director = MainControl.getDirector();
            var startTime = +new Date();
            this.setBounds(0,0,director.width,director.height);
            var loadActor = new CAAT.Foundation.ActorContainer()
                    .setBounds(0,0,director.width,director.height);
            this.addChild(loadActor);
            var CANVAS_WIDTH = director.width;
            var roundedRect=function(ctx,x,y,width,height,radius,fill,stroke){
                    ctx.save();	// save the context so we don't mess up others
                    ctx.beginPath();

                    // draw top and top right corner
                    ctx.moveTo(x+radius,y);
                    ctx.arcTo(x+width,y,x+width,y+radius,radius);

                    // draw right side and bottom right corner
                    ctx.arcTo(x+width,y+height,x+width-radius,y+height,radius); 

                    // draw bottom and bottom left corner
                    ctx.arcTo(x,y+height,x,y+height-radius,radius);

                    // draw left and top left corner
                    ctx.arcTo(x,y,x+radius,y,radius);

                    if(fill){
                    ctx.fill();
                    }
                    if(stroke){
                    ctx.stroke();
                    }
                    ctx.restore();	// restore context to what it was on entry
            };
            var radius=Math.PI/12;
            var StrLoadd="";
            loadActor.paint = function(director,time){
                var ctx = director.ctx;
                ctx.beginPath();
                if(loadedPercent<0) loadedPercent = 0;
                if(loadedPercent<1) return;
                if(loadedPercent<2) return;
                var rectWidth = 100;
                var rectHeight = 100;
                var rectX = this.width/2 - rectWidth/2;
                var rectY = this.height/2 - rectHeight/2;
                var cornerRadius = 20;
                ctx.fillStyle = "#cfcbca";
                roundedRect(ctx,0,0,this.width,this.height,cornerRadius,true,false);
                ctx.fillStyle = "#236186";
                roundedRect(ctx,10,10,this.width-20,this.height-20,cornerRadius,true,false);
                ctx.fillStyle = "black";
                ctx.globalAlpha=0.3;
                roundedRect(ctx,rectX,rectY,rectWidth,rectHeight,cornerRadius,false,true);
                ctx.fillStyle = "cfcbca";
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 10;
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.globalAlpha=1;
                ctx.fillStyle = "white";
                ctx.font = "20px Times New Roman";
                ctx.fillText(loadedPercent+"%",CANVAS_WIDTH/2-ctx.measureText(loadedPercent+"%").width/2,this.height/2+5);
                ctx.fillText("LOADING"+StrLoadd,CANVAS_WIDTH/2-ctx.measureText("LOADING...").width/2,this.height/2-60);
                var indexloadTime=(+new Date()-startTime)%2000;
                if(indexloadTime<500) StrLoadd="";
                if(indexloadTime>=500) StrLoadd=".";
                if(indexloadTime>=1000) StrLoadd="..";
                if(indexloadTime>=1500) StrLoadd="...";	
                if(indexloadTime>=1900) StrLoadd="....";				
                ctx.lineWidth = 2;
                ctx.stroke();
                radius+=4*Math.PI/180;
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(rectX+rectWidth/2 , rectY+rectHeight/2, 30, radius, radius+2 * Math.PI-30*Math.PI/180, false);
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#003300';
                ctx.stroke();
                ctx.closePath();
                if(loadAudios&&loadImages&&(+new Date() - startTime>1000)) {
                    //run(director,loadImages,loadAudios);
                    MainControl.afterLoadScene(loadImages, loadAudios);
                    //scene.removeChild(this);
                }
            };
            load();
        }
    };

    extend(CAAT.SceneLoadCtn, CAAT.ActorContainer);

})();