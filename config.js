//////////////////////////////////////////////////////////////////////////////////////
// Config

// sets map, fruit position, actor starting positions for a given configuration
//
var tileMap;
var config = {

    // set configuration to original arcade Pac-Man
    setOriginal: function() {

        tileMap = new TileMap(28, 36, (
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

        // apply ghost turning constraints to this map
        tileMap.constrainGhostTurns = function(x,y,openTiles) {
            // prevent ghost from turning up at these tiles
            if ((x == 12 || x == 15) && (y == 14 || y == 26)) {
                openTiles[DIR_UP] = false;
            }
        };

        // row for the displayed message
        tileMap.messageRow = 22;

        // ghost home location
        tileMap.doorTile = {x:13, y:14};
        tileMap.doorPixel = {
            x:(tileMap.doorTile.x+1)*tileSize-1, 
            y:tileMap.doorTile.y*tileSize + midTile.y
        };
        tileMap.homeTopPixel = 17*tileSize;
        tileMap.homeBottomPixel = 18*tileSize;

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
            x: tileMap.numCols-1-2,
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
            x: tileMap.numCols-1,
            y: tileMap.numRows - 2,
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
            y: tileMap.numRows-2,
        };
        clyde.startMode = GHOST_PACING_HOME;
        clyde.arriveHomeMode = GHOST_PACING_HOME;

        pacman.startDirEnum = DIR_LEFT;
        pacman.startPixel = {
            x: tileSize*tileMap.numCols/2,
            y: 26*tileSize + midTile.y,
        };

    },
};
