import * as direction from '../direction.js'

function closestFood(map, open, visited) {
    while (open.length) {
        const pos = open.pop()
        const tile = map.getTile(pos.x, pos.y)
        if (tile == '.' || tile == 'o') return pos
        if (map.isWalkable(pos.x + 1, pos.y) && !(`${pos.x + 1},${pos.y}` in visited))
            open.unshift({ x: pos.x + 1, y: pos.y, dist: pos.dist + 1, dir: pos.dir === undefined ? direction.right : pos.dir, parent: pos })
        if (map.isWalkable(pos.x - 1, pos.y) && !(`${pos.x - 1},${pos.y}` in visited))
            open.unshift({ x: pos.x - 1, y: pos.y, dist: pos.dist + 1, dir: pos.dir === undefined ? direction.left : pos.dir, parent: pos })
        if (map.isWalkable(pos.x, pos.y + 1) && !(`${pos.x},${pos.y + 1}` in visited))
            open.unshift({ x: pos.x, y: pos.y + 1, dist: pos.dist + 1, dir: pos.dir === undefined ? direction.down : pos.dir, parent: pos })
        if (map.isWalkable(pos.x, pos.y - 1) && !(`${pos.x},${pos.y - 1}` in visited))
            open.unshift({ x: pos.x, y: pos.y - 1, dist: pos.dist + 1, dir: pos.dir === undefined ? direction.up : pos.dir, parent: pos })
        visited[`${pos.x},${pos.y}`] = true
    }
}

export function getPossibleDirs(game) {
    const possibleDirs = []
    const pos = game.player.tile
    for (let i = 0; i < 4; ++i) {
        // if (i == direction.reverse(game.player.dir)) continue
        const vec = direction.vectors[i]
        if (game.map.isWalkable(pos.x + vec.x, pos.y + vec.y))
            possibleDirs.push(i)
    }
    return possibleDirs
}

export function extractSimpleFeatures(game) {
    const playerPos = game.player.tile

    let closeGhosts = 0
    let ghostsTop = 0
    let ghostsBottom = 0
    let ghostsLeft = 0
    let ghostsRight = 0
    for (const ghost of game.ghosts) {
        const ghostPos = ghost.tile
        const dx = ghostPos.x - playerPos.x
        const dy = ghostPos.y - playerPos.y
        if (Math.abs(dx) + Math.abs(dy) <= 1) {
            ++closeGhosts
            if (dx > 0) ++ghostsRight
            else if (dx < 0) ++ghostsLeft
            else if (dy > 0) ++ghostsBottom
            else if (dy < 0) ++ghostsTop
        } else if (Math.abs(dx) + Math.abs(dy) <= 2) {
            ++closeGhosts
        }
    }

    let food = closestFood(game.map, [{ x: playerPos.x, y: playerPos.y, dist: 0 }], {})
    // foodDist /= tilesX * tilesY

    return {
        'close-ghosts': closeGhosts,
        'ghost-top': ghostsTop,
        'ghost-bottom': ghostsBottom,
        'ghost-left': ghostsLeft,
        'ghost-right': ghostsRight,
        // 'closest-food': food.dist,
        'food-top': food.dir == direction.up,
        'food-bottom': food.dir == direction.down,
        'food-left': food.dir == direction.left,
        'food-right': food.dir == direction.right,
        'scared-ghosts': game.energizer.active,
    }
}
