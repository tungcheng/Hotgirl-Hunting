(function () {
    CAAT.MyTextActor = function () {
        CAAT.MyTextActor.superclass.constructor.call(this);
        return this;
    }

    CAAT.MyTextActor.prototype = {
        director: null,
        text: null,
        lines: null,
        lineNumber: null,

        lineHeight: null,

        hAlign: "justify",
        vAlign: "top",

        style: "fill",

        textFillStyle: "#000000",
        textStrokeStyle: "#000000",

        font: "Times New Roman",
        fontSize: 14,
        fontStyle: "",

        showBorder: null,

        initialize: function (director, text, width) {
            this.text = text;
            this.director = director;
            this.width = width;
            this.lines = [];
            this.lineNumber = 0;
            this.lineHeight = 16;
            this.showBorder = false;

            this.calculateText();
            return this;
        },

        paint: function (director, time) {
            CAAT.MyTextActor.superclass.paint.call(this, director, time);
            var ctx = director.ctx;

            ctx.font = this.fontStyle + " " + this.fontSize + "px " + this.font;
            ctx.fillStyle = this.textFillStyle;
            ctx.strokeStyle = this.textStrokeStyle;
            ctx.textBaseline = this.vAlign;
            var y = 0;
            for (var li in this.lines) {
                var lines = this.lines[li];
                var x = lines.startX;
                for (wo in lines.Words) {
                    if (this.style == "fill") {
                        ctx.fillText(lines.Words[wo].word, x, y);
                    } else {
                        ctx.strokeText(lines.Words[wo].word, x, y);
                    }
                    x += lines.Words[wo].length + lines.userSpace;
                }
                y += this.lineHeight;
            }

            if (this.showBorder) {
                ctx.strokeRect(0, 0, this.width, this.height);
            }
        },

        calculateText: function () {
            var ctx = this.director.ctx;
            var text = this.text;
            var width = this.width;

            ctx.font = this.fontStyle + " " + this.fontSize + "px " + this.font;


            text = text.replace(/[\n]/g, " \n ");
            text = text.replace(/\r/g, "");
            var words = text.split(/[ ]/);
            var spaceWidth = ctx.measureText(' ').width;

            var currentSize = 0;
            var lines = [];
            var lineNumber = 0;
            var str;
            // Create lines object
            // Lines object: Words {Array} + EndParagraph {boolean} + startX {number} + spaceUser {number} 
            lines[lineNumber] = {};
            lines[lineNumber].Words = [];
            i = 0;
            while (i < words.length) {
                var word = words[i];
                // If word is /n, end paragraph
                if (word == '\n') {
                    lines[lineNumber].EndParagraph = true;
                    lineNumber++;
                    // Reset size calculate 
                    currentSize = 0;
                    // Create new object in lines
                    lines[lineNumber] = {};
                    lines[lineNumber].Words = [];
                    i++;
                }
                else {
                    str = {};
                    str.length = ctx.measureText(word).width;
                    if (currentSize === 0) {
                        // If word have length large than this width
                        while (str.length > width) {
                            word = word.slice(0, word.length - 1);
                            str.length = ctx.measureText(word).width;
                        }
                        str.word = word;
                        lines[lineNumber].Words.push(str);
                        currentSize = str.length;
                        if (word != words[i]) {
                            Words[i] = Words[i].splice(word.length, Words[i].length - 1);
                        } else {
                            i++;
                        }
                    }
                    else {
                        if (currentSize + spaceWidth + str.length > width) {
                            lines[lineNumber].EndParagraph = false;
                            lineNumber++;
                            // Reset size calculate 
                            currentSize = 0;
                            // Create new object in lines
                            lines[lineNumber] = {};
                            lines[lineNumber].Words = [];
                        }
                        else {
                            str.word = word;
                            lines[lineNumber].Words.push(str);
                            currentSize += spaceWidth + str.length;
                            i++;
                        }
                    }
                }
            }
            lines[lineNumber].EndParagraph = true;

            for (var li in lines) {
                var totallen = 0;
                var startX, userSpace;
                var line = lines[li];
                for (wo in line.Words) totallen += line.Words[wo].length;
                if (this.hAlign == "center") {
                    userSpace = spaceWidth;
                    startX = width / 2 - (totallen + spaceWidth * (line.Words.length - 1)) / 2;
                }
                else {
                    if ((this.hAlign == "justify") && (!line.EndParagraph)) {
                        startX = 0;
                        userSpace = (width - totallen) / (line.Words.length - 1);
                    }
                    else {
                        if (this.hAlign == "right") {
                            startX = width - (totallen + sp * (line.Words.length - 1));
                            userSpace = spaceWidth;
                        }
                        else { /* left */
                            startX = 0;
                            userSpace = spaceWidth;
                        }
                    }
                }
                lines[li].startX = startX;
                lines[li].userSpace = userSpace;
            }
            var height = (lineNumber + 1) * this.lineHeight;
            this.setSize(width, height);
            this.lines = lines;
            this.lineNumber = lineNumber;
            return this;
        },

        setText: function (text) {
            this.text = text;
            this.calculateText();
            return this;
        },

        setStyle: function (style) {
            this.style = style;
            return this;
        },

        setHorizontalAlign: function (align) {
            this.hAlign = align;
            this.calculateText();
            return this;
        },

        setVerticalAlign: function (align) {
            this.vAlign = align;
            return this;
        },

        setTextFillStyle: function (fillStyle) {
            this.textFillStyle = fillStyle;
            return this;
        },

        setTextStrokeStyle: function (strokeStyle) {
            this.textStrokeStyle = strokeStyle;
            return this;
        },

        setLineHeight: function (height) {
            this.lineHeight = height;
            this.setSize(this.width, this.lineNumber * height);
            return this;
        },

        setFont: function (font) {
            this.font = font;
            this.calculateText();
            return this;
        },

        setFontStyle: function (fontStyle) {
            this.fontStyle = fontStyle;
            this.calculateText();
            return this;
        },

        setFontSize: function (fontSize) {
            this.fontSize = fontSize;
            this.calculateText();
            return this;
        },

        setShowBorder: function (showBorder) {
            this.showBorder = showBorder;
            return this;
        }
    }
    extend(CAAT.MyTextActor, CAAT.Foundation.ActorContainer);
})();