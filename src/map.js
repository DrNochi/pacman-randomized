export const tileSize = 8
export const tilesX = 28
export const tilesY = 36

export const doormatTile = {
    x: 14, // todo original 13
    y: 14
}

export const doormatPixel = {
    x: doormatTile.x * tileSize,
    y: (doormatTile.y + 0.5) * tileSize
}

const tunnelMargin = 2

export class Map {

    dots = 0
    tunnels = {}

    paths = []

    constructor(tiles) {
        this.tiles = tiles.split('')

        this.parseDots()
        this.parseTunnels()
    }

    getTile(x, y) {
        if (x >= 0 && x < tilesX)
            return this.tiles[y * tilesX + x]
        else if (y in this.tunnels)
            return ' '
        else if ((y - 1 in this.tunnels) || (y + 1 in this.tunnels))
            return '|'
        else
            return '_'
    }

    isWalkable(x, y) {
        const tile = this.getTile(x, y)
        return tile == ' ' || tile == '.' || tile == 'o'
    }

    parseDots() {
        for (const tile of this.tiles)
            if (tile == '.' || tile == 'o')
                ++this.dots
    }

    parseTunnels() {
        const that = this
        function tunnelEntrance(x, y, dx) {
            while (!that.isWalkable(x, y - 1) && !that.isWalkable(x, y + 1) && that.isWalkable(x, y))
                x += dx
            return x
        }

        for (let y = 0; y < tilesY; ++y)
            if (this.isWalkable(0, y) && this.isWalkable(tilesX - 1, y))
                this.tunnels[y] = {
                    'leftEntrance': tunnelEntrance(0, y, 1),
                    'rightEntrance': tunnelEntrance(tilesX - 1, y, -1),
                }
    }

    teleport(actor) {
        const tile = actor.tile
        const tunnel = this.tunnels[tile.y]

        if (tunnel) {
            const offset = (tunnelMargin + tilesX + tunnelMargin) * tileSize
            if (tile.x < -tunnelMargin) actor.pos.x += offset
            else if (tile.x > tunnelMargin + tilesX - 1) actor.pos.x -= offset
        }
    }

    eatDot(x, y) {
        this.tiles[y * tilesX + x] = ' '
        --this.dots
    }

}

export default Map
