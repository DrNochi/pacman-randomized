//////////////////////////////////////////////////////////////////////////////////////
// maps

// available maps
var maps;

// create maps
(function() {
    // default onLoad function for TileMaps
    // contains potentially map-specific locations
    var onLoad = function() {

        // ghost home location
        this.doorTile = {x:13, y:14};
        this.doorPixel = {
            x:(this.doorTile.x+1)*tileSize-1, 
            y:this.doorTile.y*tileSize + midTile.y
        };
        this.homeTopPixel = 17*tileSize;
        this.homeBottomPixel = 18*tileSize;

        // location of the fruit
        var fruitTile = {x:13, y:20};
        fruit.setPosition(tileSize*(1+fruitTile.x)-1, tileSize*fruitTile.y + midTile.y);

        // actor starting states

        blinky.startDirEnum = DIR_LEFT;
        blinky.startPixel = {
            x: 14*tileSize-1,
            y: 14*tileSize+midTile.y
        };
        blinky.cornerTile = {
            x: this.numCols-1-2,
            y: 0
        };
        blinky.startMode = GHOST_OUTSIDE;
        blinky.arriveHomeMode = GHOST_LEAVING_HOME;

        pinky.startDirEnum = DIR_DOWN;
        pinky.startPixel = {
            x: 14*tileSize-1,
            y: 17*tileSize+midTile.y,
        };
        pinky.cornerTile = {
            x: 2,
            y: 0
        };
        pinky.startMode = GHOST_PACING_HOME;
        pinky.arriveHomeMode = GHOST_PACING_HOME;

        inky.startDirEnum = DIR_UP;
        inky.startPixel = {
            x: 12*tileSize-1,
            y: 17*tileSize + midTile.y,
        };
        inky.cornerTile = {
            x: this.numCols-1,
            y: this.numRows - 2,
        };
        inky.startMode = GHOST_PACING_HOME;
        inky.arriveHomeMode = GHOST_PACING_HOME;

        clyde.startDirEnum = DIR_UP;
        clyde.startPixel = {
            x: 16*tileSize-1,
            y: 17*tileSize + midTile.y,
        };
        clyde.cornerTile = {
            x: 0,
            y: this.numRows-2,
        };
        clyde.startMode = GHOST_PACING_HOME;
        clyde.arriveHomeMode = GHOST_PACING_HOME;

        pacman.startDirEnum = DIR_LEFT;
        pacman.startPixel = {
            x: tileSize*this.numCols/2,
            y: 26*tileSize + midTile.y,
        };
    };


    var mapPacman = new TileMap(28, 36, (
        "____________________________" +
        "____________________________" +
        "____________________________" +
        "||||||||||||||||||||||||||||" +
        "|............||............|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|o|__|.|___|.||.|___|.|__|o|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|..........................|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|......||....||....||......|" +
        "||||||.||||| || |||||.||||||" +
        "_____|.||||| || |||||.|_____" +
        "_____|.||          ||.|_____" +
        "_____|.|| |||--||| ||.|_____" +
        "||||||.|| |______| ||.||||||" +
        "      .   |______|   .      " +
        "||||||.|| |______| ||.||||||" +
        "_____|.|| |||||||| ||.|_____" +
        "_____|.||          ||.|_____" +
        "_____|.|| |||||||| ||.|_____" +
        "||||||.|| |||||||| ||.||||||" +
        "|............||............|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|o..||.......  .......||..o|" +
        "|||.||.||.||||||||.||.||.|||" +
        "|||.||.||.||||||||.||.||.|||" +
        "|......||....||....||......|" +
        "|.||||||||||.||.||||||||||.|" +
        "|.||||||||||.||.||||||||||.|" +
        "|..........................|" +
        "||||||||||||||||||||||||||||" +
        "____________________________" +
        "____________________________"));

    mapPacman.onLoad = onLoad;
    mapPacman.color = "#00C";
    mapPacman.constrainGhostTurns = function(x,y,openTiles) {
        // prevent ghost from turning up at these tiles
        if ((x == 12 || x == 15) && (y == 14 || y == 26)) {
            openTiles[DIR_UP] = false;
        }
    };

    var mapMsPacman1 = new TileMap(28, 36, (
        "____________________________" +
        "____________________________" +
        "____________________________" +
        "||||||||||||||||||||||||||||" +
        "|......||..........||......|" +
        "|o||||.||.||||||||.||.||||o|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|..........................|" +
        "|||.||.|||||.||.|||||.||.|||" +
        "__|.||.|||||.||.|||||.||.|__" +
        "|||.||.|||||.||.|||||.||.|||" +
        "   .||.......||.......||.   " +
        "|||.||||| |||||||| |||||.|||" +
        "__|.||||| |||||||| |||||.|__" +
        "__|.                    .|__" +
        "__|.||||| |||--||| |||||.|__" +
        "__|.||||| |______| |||||.|__" +
        "__|.||    |______|    ||.|__" +
        "__|.|| || |______| || ||.|__" +
        "|||.|| || |||||||| || ||.|||" +
        "   .   ||          ||   .   " +
        "|||.|||||||| || ||||||||.|||" +
        "__|.|||||||| || ||||||||.|__" +
        "__|.......   ||   .......|__" +
        "__|.|||||.||||||||.|||||.|__" +
        "|||.|||||.||||||||.|||||.|||" +
        "|..........................|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|.||||.||....||....||.||||.|" +
        "|o||||.||.||||||||.||.||||o|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|..........................|" +
        "||||||||||||||||||||||||||||" +
        "____________________________" +
        "____________________________"));

    mapMsPacman1.onLoad = onLoad;
    mapMsPacman1.color = "#FFB8AE";

    var mapMsPacman2 = new TileMap(28, 36, (
        "____________________________" +
        "____________________________" +
        "____________________________" +
        "||||||||||||||||||||||||||||" +
        "       ||..........||       " +
        "|||||| ||.||||||||.|| ||||||" +
        "|||||| ||.||||||||.|| ||||||" +
        "|o...........||...........o|" +
        "|.|||||||.||.||.||.|||||||.|" +
        "|.|||||||.||.||.||.|||||||.|" +
        "|.||......||.||.||......||.|" +
        "|.||.|||| ||....|| ||||.||.|" +
        "|.||.|||| |||||||| ||||.||.|" +
        "|......|| |||||||| ||......|" +
        "||||||.||          ||.||||||" +
        "||||||.|| |||--||| ||.||||||" +
        "|......|| |______| ||......|" +
        "|.||||.|| |______| ||.||||.|" +
        "|.||||.   |______|   .||||.|" +
        "|...||.|| |||||||| ||.||...|" +
        "|||.||.||          ||.||.|||" +
        "__|.||.|||| |||| ||||.||.|__" +
        "__|.||.|||| |||| ||||.||.|__" +
        "__|.........||||.........|__" +
        "__|.|||||||.||||.|||||||.|__" +
        "|||.|||||||.||||.|||||||.|||" +
        "   ....||...    ...||....   " +
        "|||.||.||.||||||||.||.||.|||" +
        "|||.||.||.||||||||.||.||.|||" +
        "|o..||.......||.......||..o|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|..........................|" +
        "||||||||||||||||||||||||||||" +
        "____________________________" +
        "____________________________"));

    mapMsPacman2.onLoad = onLoad;
    mapMsPacman2.color = "#47b8ff";

    var mapMsPacman3 = new TileMap(28, 36, (
        "____________________________" +
        "____________________________" +
        "____________________________" +
        "||||||||||||||||||||||||||||" +
        "|.........||....||.........|" +
        "|o|||||||.||.||.||.|||||||o|" +
        "|.|||||||.||.||.||.|||||||.|" +
        "|.||.........||.........||.|" +
        "|.||.||.||||.||.||||.||.||.|" +
        "|....||.||||.||.||||.||....|" +
        "||||.||.||||.||.||||.||.||||" +
        "||||.||..............||.||||" +
        " ....|||| |||||||| ||||.... " +
        "|.|| |||| |||||||| |||| ||.|" +
        "|.||                    ||.|" +
        "|.|||| || |||--||| || ||||.|" +
        "|.|||| || |______| || ||||.|" +
        "|.     || |______| ||     .|" +
        "|.|| |||| |______| |||| ||.|" +
        "|.|| |||| |||||||| |||| ||.|" +
        "|.||                    ||.|" +
        "|.|||| ||||| || ||||| ||||.|" +
        "|.|||| ||||| || ||||| ||||.|" +
        "|......||.   ||   .||......|" +
        "|||.||.||.||||||||.||.||.|||" +
        "|||.||.||.||||||||.||.||.|||" +
        "|o..||.......  .......||..o|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|.||||.|||||.||.|||||.||||.|" +
        "|......||....||....||......|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|......||..........||......|" +
        "||||||||||||||||||||||||||||" +
        "____________________________" +
        "____________________________"));

    mapMsPacman3.onLoad = onLoad;
    mapMsPacman3.color = "#de9751";

    var mapMsPacman4 = new TileMap(28, 36, (
        "____________________________" +
        "____________________________" +
        "____________________________" +
        "||||||||||||||||||||||||||||" +
        "|..........................|" +
        "|.||.||||.||||||||.||||.||.|" +
        "|o||.||||.||||||||.||||.||o|" +
        "|.||.||||.||....||.||||.||.|" +
        "|.||......||.||.||......||.|" +
        "|.||||.||.||.||.||.||.||||.|" +
        "|.||||.||.||.||.||.||.||||.|" +
        "|......||....||....||......|" +
        "|||.|||||||| || ||||||||.|||" +
        "__|.|||||||| || ||||||||.|__" +
        "__|....||          ||....|__" +
        "||| ||.|| |||--||| ||.|| |||" +
        "    ||.|| |______| ||.||    " +
        "||||||.   |______|   .||||||" +
        "||||||.|| |______| ||.||||||" +
        "    ||.|| |||||||| ||.||    " +
        "||| ||.||          ||.|| |||" +
        "__|....||||| || |||||....|__" +
        "__|.||.||||| || |||||.||.|__" +
        "__|.||....   ||   ....||.|__" +
        "__|.|||||.|| || ||.|||||.|__" +
        "|||.|||||.|| || ||.|||||.|||" +
        "|.........||    ||.........|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|.||||.||.||||||||.||.||||.|" +
        "|.||...||..........||...||.|" +
        "|o||.|||||||.||.|||||||.||o|" +
        "|.||.|||||||.||.|||||||.||.|" +
        "|............||............|" +
        "||||||||||||||||||||||||||||" +
        "____________________________" +
        "____________________________"));

    mapMsPacman4.onLoad = onLoad;
    mapMsPacman4.color = "#2121ff";

    // create global list of maps
    maps = [
        mapPacman,
        mapMsPacman1,
        mapMsPacman2,
        mapMsPacman3,
        mapMsPacman4,
    ];


})();

// current map defaults to first
var tileMap = maps[0];