import * as directions from './direction.js'

export function targetPlayer(game) {
    return game.player.tile
}

export function targetAheadPlayer(game) {
    const tile = game.player.tile
    const vec = directions.vectors[game.player.dir]
    const target = {
        x: tile.x + 4 * vec.x,
        y: tile.y + 4 * vec.y
    }

    // overflow bug in original game
    if (false && game.player.dir == directions.up)
        target.x -= 4

    return target
}

export function targetOppositeFactory(other) {
    return function targetOpposite(game) {
        const tile = game.player.tile
        const vec = directions.vectors[game.player.dir]
        const midpoint = {
            x: tile.x + 2 * vec.x,
            y: tile.y + 2 * vec.y
        }

        // overflow bug in original game
        if (false && game.player.dir == directions.up)
            midpoint.x -= 2

        const otherTile = other.tile
        const target = {
            x: otherTile.x + 2 * (midpoint.x - otherTile.x),
            y: otherTile.y + 2 * (midpoint.y - otherTile.y)
        }

        return target
    }
}

export function targetPlayerFeintFactory(retreatTile, minDist) {
    return function targetPlayerFeint(game) {
        const tile = this.tile
        const playerTile = game.player.tile
        const vec = directions.vectors[this.dir]

        const dx = playerTile.x - tile.x - vec.x
        const dy = playerTile.y - tile.y - vec.y
        const dist = dx * dx + dy * dy

        if (dist >= minDist) return playerTile
        else return retreatTile
    }
}
