//////////////////////////////////////////////////////////////////////////////////////
// Screen

var screen = (function() {

    // html elements
    var divContainer;
    var canvas, ctx;
    var bgCanvas, bgCtx;

    var scale = 1.5;

    var makeCanvas = function() {
        var c = document.createElement("canvas");
        c.width = tileMap.widthPixels*scale;
        c.height = tileMap.heightPixels*scale;
        c.getContext("2d").scale(scale,scale);
        return c;
    };

    var addControls = function() {
        var form = document.createElement('form');
        var aiCheckbox = document.createElement('input');
        aiCheckbox.type = 'checkbox';
        aiCheckbox.id = 'aiCheckbox';
        aiCheckbox.onchange = function() { pacman.ai = aiCheckbox.checked; };
        var label = document.createElement('label');
        label.htmlFor = 'aiCheckbox';
        label.appendChild(document.createTextNode('attract mode'));
        form.appendChild(aiCheckbox);
        form.appendChild(label);
        divContainer.appendChild(form);
    };

    var addInput = function() {
        // handle key press event
        document.onkeydown = function(e) {
            var key = (e||window.event).keyCode;
            switch (key) {
                case 37: pacman.setNextDir(DIR_LEFT); break; // left
                case 38: pacman.setNextDir(DIR_UP); break; // up
                case 39: pacman.setNextDir(DIR_RIGHT); break; // right
                case 40: pacman.setNextDir(DIR_DOWN); break;// down
                default: return;
            }
            e.preventDefault();
        };
    };

    return {
        create: function() {
            canvas = makeCanvas();
            bgCanvas = makeCanvas();
            ctx = canvas.getContext("2d");
            bgCtx = bgCanvas.getContext("2d");

            divContainer = document.getElementById('pacman');
            divContainer.appendChild(canvas);
            addControls();
            addInput();

            var that = this;
            canvas.onmousedown = function() {
                if (that.onClick)
                    that.onClick();
            };
        },
        drawMap: function() {
            tileMap.draw(bgCtx);
        },
        blitMap: function() {
            ctx.scale(1/scale,1/scale);
            ctx.drawImage(bgCanvas,0,0);
            ctx.scale(scale,scale);
        },
        erasePellet: function(x,y) {
            tileMap.erasePellet(bgCtx,x,y);
        },
        drawEnergizers: function() {
            tileMap.drawEnergizers(ctx);
        },
        drawMessage: function(text, color) {
            ctx.font = "bold " + 2*tileSize + "px sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = color;
            ctx.fillText(text, tileMap.numCols*tileSize/2, tileMap.messageRow*tileSize);
        },
        drawEatenPoints: function() {
            var text = energizer.getPoints();
            ctx.font = 1.5*tileSize + "px sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "#0FF";
            ctx.fillText(text, pacman.pixel.x, pacman.pixel.y);
        },
        drawExtraLives: function() {
            var i;
            for (i=0; i<game.extraLives; i++)
                this.drawCenteredSquare((2*i+3)*tileSize, (tileMap.numRows-2)*tileSize+midTile.y,"rgba(255,255,0,0.6)",actorSize);
        },
        drawLevelIcons: function() {
            var i;
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            var w = 2;
            var h = actorSize;
            for (i=0; i<game.level; i++)
                ctx.fillRect((tileMap.numCols-2)*tileSize - i*2*w, (tileMap.numRows-2)*tileSize+midTile.y-h/2, w, h);
        },
        drawScore: function() {
            ctx.font = 1.5*tileSize + "px sans-serif";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFF";
            ctx.fillText(game.score, tileSize, tileSize*2);

            ctx.font = "bold " + 1.5*tileSize + "px sans-serif";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText("high score", tileSize*tileMap.numCols/2, 3);
            ctx.fillText(game.highScore, tileSize*tileMap.numCols/2, tileSize*2);
        },
        drawCenteredSquare: function(px,py,color,size) {
            ctx.fillStyle = color;
            ctx.fillRect(px-size/2, py-size/2, size, size);
        },
        drawFruit: function() {
            if (fruit.isPresent()) {
                this.drawCenteredSquare(fruit.pixel.x, fruit.pixel.y, "rgba(0,255,0,0.7)", tileSize+2);
            }
            else if (fruit.isScorePresent()) {
                ctx.font = 1.5*tileSize + "px sans-serif";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillStyle = "#FFF";
                ctx.fillText(fruit.getPoints(), fruit.pixel.x, fruit.pixel.y);
            }
        },
        drawGhost: function(g) {
            if (g.mode == GHOST_EATEN)
                return;
            var color = g.color;
            if (g.scared)
                color = energizer.isFlash() ? "#FFF" : "#00F";
            else if (g.mode == GHOST_GOING_HOME || g.mode == GHOST_ENTERING_HOME)
                color = "rgba(255,255,255,0.2)";
            this.drawCenteredSquare(g.pixel.x, g.pixel.y, color, actorSize);
        },
        drawPacman: function() {
            this.drawCenteredSquare(pacman.pixel.x, pacman.pixel.y, pacman.color, actorSize);
        },
        drawActors: function() {
            var i;
            // draw such that pacman appears on top
            if (energizer.isActive()) {
                for (i=0; i<4; i++)
                    this.drawGhost(actors[i]);
                if (!energizer.showingPoints())
                    this.drawPacman();
                else
                    this.drawEatenPoints();
            }
            // draw such that pacman appears on bottom
            else {
                this.drawPacman();
                for (i=3; i>=0; i--) 
                    this.drawGhost(actors[i]);
            }
        },
    };
})();
