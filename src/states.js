//////////////////////////////////////////////////////////////////////////////////////
// States
// (main loops for each state of the game)
// state is set to any of these states, each containing an init(), draw(), and update()

// current game state
var state;

// switches to another game state
var switchState = function(nextState,fadeDuration, continueUpdate1, continueUpdate2) {
    state = (fadeDuration) ? fadeNextState(state,nextState,fadeDuration,continueUpdate1, continueUpdate2) : nextState;
    state.init();
};

//////////////////////////////////////////////////////////////////////////////////////
// Fade state

// Creates a state that will fade from a given state to another in the given amount of time.
// if continueUpdate1 is true, then prevState.update will be called while fading out
// if continueUpdate2 is true, then nextState.update will be called while fading in
var fadeNextState = function (prevState, nextState, frameDuration, continueUpdate1, continueUpdate2) {
    var frames;
    var inFirstState = function() { return frames < frameDuration/2; };
    var getStateTime = function() { return inFirstState() ? frames/frameDuration*2 : frames/frameDuration*2-1; };
    var initialized = false;

    return {
        init: function() {
            frames = 0;
            canvas.onmousedown = undefined; // remove all click events from previous state
            initialized = true;
        },
        draw: function() {
            if (!initialized) return;
            var t = getStateTime();
            if (inFirstState()) {
                if (prevState) {
                    prevState.draw();
                    renderer.drawFadeIn(1-t);
                }
            }
            else {
                nextState.draw();
                renderer.drawFadeIn(t);
            }
        },
        update: function() {
            if (inFirstState()) {
                if (continueUpdate1) prevState.update();
            }
            else {
                if (continueUpdate2) nextState.update();
            }

            if (frames == frameDuration) {
                state = nextState; // hand over state
                initialized = false;
            }
            else {
                if (frames == frameDuration/2)
                    nextState.init();
                frames++;
            }
        },
    }
};

//////////////////////////////////////////////////////////////////////////////////////
// Menu State
// (the home title screen state)

var menuState = {
    init: function() {
        menu.setInput();
    },
    draw: function() {
        renderer.renderFunc(menu.draw);
    },
    update: function() {
    },
};

////////////////////////////////////////////////////
// New Game state
// (state when first starting a new game)

var newGameState = (function() {
    var frames;
    var duration = 2;

    return {
        init: function() {
            if (this.nextMap != undefined) {
                map = this.nextMap;
                this.nextMap = undefined;
            }
            frames = 0;
            map.resetCurrent();
            renderer.drawMap();
            extraLives = 3;
            level = 1;
            score = 0;
        },
        draw: function() {
            if (!map)
                return;
            renderer.blitMap();
            renderer.drawEnergizers();
            renderer.drawExtraLives();
            renderer.drawLevelIcons();
            renderer.drawScore();
            renderer.drawMessage("ready","#FF0");
        },
        update: function() {
            if (frames == duration*60) {
                extraLives--;
                switchState(readyNewState);
            }
            else 
                frames++;
        },
    };
})();

////////////////////////////////////////////////////
// Ready state
// (state when map is displayed and pausing before play)

var readyState =  (function(){
    var frames;
    var duration = 2;
    
    return {
        init: function() {
            var i;
            for (i=0; i<5; i++)
                actors[i].reset();
            ghostCommander.reset();
            fruit.reset();
            energizer.reset();
            map.resetTimeEaten();
            frames = 0;
        },
        draw: function() {
            newGameState.draw();
            renderer.drawActors();
        },
        update: function() {
            if (frames == duration*60)
                switchState(playState);
            else
                frames++;
        },
    };
})();

////////////////////////////////////////////////////
// Ready New Level state
// (ready state when pausing before new level)

var readyNewState = { 

    // inherit functions from readyState
    __proto__: readyState, 

    init: function() {

        // switch to next map if given
        if (this.nextMap != undefined) {
            map = this.nextMap;
            this.nextMap = undefined;
            map.resetCurrent();
            renderer.drawMap();
        }
        ghostReleaser.onNewLevel();
        elroyTimer.onNewLevel();

        // inherit attributes from readyState
        readyState.init.call(this);
    },
};

////////////////////////////////////////////////////
// Ready Restart Level state
// (ready state when pausing before restarted level)

var readyRestartState = { 

    // inherit functions from readyState
    __proto__: readyState, 

    init: function() {
        extraLives--;
        ghostReleaser.onRestartLevel();
        elroyTimer.onRestartLevel();

        // inherit attributes from readyState
        readyState.init.call(this);
    },
};

////////////////////////////////////////////////////
// Play state
// (state when playing the game)

var playState = {
    init: function() { vcr.reset(); },
    draw: function() {
        renderer.blitMap();
        renderer.drawEnergizers();
        renderer.drawExtraLives();
        renderer.drawLevelIcons();
        renderer.drawScore();
        renderer.drawFruit();
        renderer.drawPaths();
        renderer.drawActors();
        renderer.drawTargets();
    },

    // handles collision between pac-man and ghosts
    // returns true if collision happened
    isPacmanCollide: function() {
        var i,g;
        for (i = 0; i<4; i++) {
            g = ghosts[i];
            if (g.tile.x == pacman.tile.x && g.tile.y == pacman.tile.y && g.mode == GHOST_OUTSIDE) {
                if (g.scared) { // eat ghost
                    energizer.addPoints();
                    g.onEaten();
                }
                else if (pacman.invincible) // pass through ghost
                    continue;
                else // killed by ghost
                    switchState(deadState);
                return true;
            }
        }
        return false;
    },
    update: function() {
        
        if (vcr.getMode() == VCR_RECORD) {

            // record current state
            vcr.record();

            var i,j; // loop index
            var maxSteps = 2;
            var skip = false;

            // skip this frame if needed,
            // but update ghosts running home
            if (energizer.showingPoints()) {
                for (j=0; j<maxSteps; j++)
                    for (i=0; i<4; i++)
                        if (ghosts[i].mode == GHOST_GOING_HOME || ghosts[i].mode == GHOST_ENTERING_HOME)
                            ghosts[i].update(j);
                energizer.updatePointsTimer();
                skip = true;
            }
            else { // make ghosts go home immediately after points disappear
                for (i=0; i<4; i++)
                    if (ghosts[i].mode == GHOST_EATEN) {
                        ghosts[i].mode = GHOST_GOING_HOME;
                        ghosts[i].targetting = 'door';
                    }
            }
            
            if (!skip) {

                // update counters
                ghostReleaser.update();
                ghostCommander.update();
                elroyTimer.update();
                fruit.update();
                energizer.update();

                // update actors one step at a time
                for (j=0; j<maxSteps; j++) {

                    // advance pacman
                    pacman.update(j);

                    // test collision with fruit
                    fruit.testCollide();

                    // finish level if all dots have been eaten
                    if (map.allDotsEaten()) {
                        this.draw();
                        switchState(finishState);
                        break;
                    }

                    // test pacman collision before and after updating ghosts
                    // (redundant to prevent pass-throughs)
                    // (if collision happens, stop immediately.)
                    if (this.isPacmanCollide()) break;
                    for (i=0;i<4;i++) actors[i].update(j);
                    if (this.isPacmanCollide()) break;
                }

                // update frame counts
                for (i=0; i<5; i++)
                    actors[i].frames++;
            }
        }
        else {
            vcr.seek();
        }
    },
};

////////////////////////////////////////////////////
// Script state
// (a state that triggers functions at certain times)

var scriptState = (function(){

    return {
        init: function() {
            this.frames = 0;        // frames since state began
            this.triggerFrame = 0;  // frames since last trigger

            this.drawFunc = undefined;   // current draw function
            this.updateFunc = undefined; // current update function
        },
        rewind: function() {
            // FIXME: handle calling the trigger's init function?

            var trigger = this.triggers[this.frames];
            if (trigger) {
                var i;
                for (i=this.frames-1; i>=0; i--) {
                    trigger = this.triggers[i];
                    if (trigger) {
                        if (trigger.init) trigger.init();
                        this.drawFunc = trigger.draw;
                        this.updateFunc = trigger.update;
                        this.triggerFrame = this.frames-i;
                        break;
                    }
                }
            }
            this.frames--;
            this.triggerFrame--;
        },
        updateWithRewind: function() {
            if (vcr.getMode() == VCR_RECORD) {
                vcr.record();
                scriptState.update.call(this);
            }
            else if (vcr.getMode() == VCR_REWIND) {
                if (this.frames == 0) {
                    state = playState;
                }
                else {
                    vcr.seek(-1);
                    scriptState.rewind.call(this);
                }
            }
        },
        update: function() {

            // if trigger is found for current time,
            // call its init() function
            // and store its draw() and update() functions
            var trigger = this.triggers[this.frames];
            if (trigger) {
                if (trigger.init) trigger.init();
                this.drawFunc = trigger.draw;
                this.updateFunc = trigger.update;
                this.triggerFrame = 0;
            }

            // call the last trigger's update function
            if (this.updateFunc) 
                this.updateFunc(this.triggerFrame);

            this.frames++;
            this.triggerFrame++;
        },
        draw: function() {
            // call the last trigger's draw function
            if (this.drawFunc) 
                this.drawFunc(this.triggerFrame);
        },
    };
})();

////////////////////////////////////////////////////
// Dead state
// (state when player has lost a life)

var deadState = (function() {
    
    // this state will always have these drawn
    var commonDraw = function() {
        renderer.blitMap();
        renderer.drawEnergizers();
        renderer.drawExtraLives();
        renderer.drawLevelIcons();
        renderer.drawScore();
        renderer.drawFruit();
    };

    return {

        // inherit script state functions
        __proto__: scriptState,

        update: function () {
            scriptState.updateWithRewind.call(this);
        },

        // script functions for each time
        triggers: {
            0: { // freeze
                update: function() {
                    var i;
                    for (i=0; i<4; i++) 
                        actors[i].frames++; // keep animating ghosts
                },
                draw: function() {
                    commonDraw();
                    renderer.drawActors();
                }
            },
            60: {
                draw: function() { // isolate pacman
                    commonDraw();
                    renderer.drawPlayer();
                },
            },
            120: {
                draw: function(t) { // dying animation
                    commonDraw();
                    renderer.drawDyingPlayer(t/75);
                },
            },
            195: {
            },
            240: {
                init: function() { // leave
                    switchState( extraLives == 0 ? overState : readyRestartState);
                }
            },
        },
    };
})();

////////////////////////////////////////////////////
// Finish state
// (state when player has completed a level)

var finishState = (function(){

    // this state will always have these drawn
    var commonDraw = function() {
        renderer.drawMap();
        renderer.blitMap();
        renderer.drawEnergizers();
        renderer.drawExtraLives();
        renderer.drawLevelIcons();
        renderer.drawScore();
        renderer.drawFruit();
        renderer.drawPlayer();
    };
    
    // flash the floor and draw
    var flashFloorAndDraw = function(on) {
        renderer.setLevelFlash(on);
        commonDraw();
    };

    return {

        // inherit script state functions
        __proto__: scriptState,

        update: function () {
            scriptState.updateWithRewind.call(this);
        },

        // script functions for each time
        triggers: {
            0: { init: function() { playState.draw(); } },
            60:  { init: function() { flashFloorAndDraw(false); } },
            120: { init: function() { flashFloorAndDraw(true); } },
            135: { init: function() { flashFloorAndDraw(false); } },
            150: { init: function() { flashFloorAndDraw(true); } },
            165: { init: function() { flashFloorAndDraw(false); } },
            180: { init: function() { flashFloorAndDraw(true); } },
            195: { init: function() { flashFloorAndDraw(false); } },
            210: { init: function() { flashFloorAndDraw(true); } },
            225: { init: function() { flashFloorAndDraw(false); } },
            255: { 
                init: function() {
                    level++;

                    if (gameMode == GAME_MSPACMAN) {
                        if (level <= 2) {
                            map = mapMsPacman1;
                        }
                        else if (level <= 5) {
                            map = mapMsPacman2;
                        }
                        else if (level <= 9) {
                            map = mapMsPacman3;
                        }
                        else if (level <= 13) {
                            map = mapMsPacman4;
                        }
                    }
                    else if (gameMode == GAME_COOKIE) {
                        map = mapgen();
                    }

                    switchState(readyNewState,60);
                    map.resetCurrent();
                    renderer.drawMap();
                }
            },
        },
    };
})();

////////////////////////////////////////////////////
// Game Over state
// (state when player has lost last life)

var overState = (function() {
    var frames;
    return {
        init: function() {
            renderer.drawMessage("game over", "#F00");
            frames = 0;
        },
        draw: function() {},
        update: function() {
            if (frames == 120) {
                switchState(menuState,60);
            }
            else
                frames++;
        },
    };
})();
