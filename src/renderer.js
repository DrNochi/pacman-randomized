import * as direction from './direction.js'
import * as sprites from './sprites.js'
import { ghostEaten, ghostGoingHome, ghostEnteringHome } from './ghost.js'
import { tileSize, tilesX, tilesY } from './map.js'
import debug from './debug.js'

export { tileSize }

const margin = 4 * tileSize
const padding = tileSize / 8

export const mapWidth = tilesX * tileSize
export const mapHeight = tilesY * tileSize

const clipWidth = padding + mapWidth + padding
const clipHeight = padding + mapHeight + padding

const width = margin + clipWidth + margin
const height = margin + clipHeight + margin

export class Canvas2DRenderer {

    canvasScale = 1

    constructor(canvas) {
        canvas.width = width
        canvas.height = height

        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    beginFrame() {
        if (debug.enabled) this.ctx.fillStyle = '#000'
        if (debug.enabled) this.ctx.fillRect(0, 0, width, height)
        if (debug.enabled) this.ctx.fillStyle = '#f446'
        if (debug.enabled) this.ctx.fillRect(0, 0, width, height)

        this.ctx.translate(margin, margin)

        this.ctx.beginPath()
        this.ctx.rect(0, 0, clipWidth, clipHeight)
        if (!debug.enabled) this.ctx.clip()

        this.ctx.fillStyle = '#000'
        this.ctx.fillRect(0, 0, clipWidth, clipHeight)
        if (debug.enabled) this.ctx.fillStyle = '#4f46'
        if (debug.enabled) this.ctx.fillRect(0, 0, clipWidth, clipHeight)

        this.overlay = null

        this.ctx.translate(padding, padding)

        if (debug.enabled) this.ctx.fillStyle = '#000'
        if (debug.enabled) this.ctx.fillRect(0, 0, mapWidth, mapHeight)
    }

    endFrame() {
        this.ctx.translate(-padding, -padding)

        if (this.overlay) {
            this.ctx.fillStyle = this.overlay
            this.ctx.fillRect(0, 0, clipWidth, clipHeight)
        }

        this.ctx.translate(-margin, -margin)
    }

    drawMenu(menu) {
        const x = menu.x, y = menu.y, w = menu.width, h = menu.height, p = menu.padding

        if (menu.title) {
            this.ctx.font = `${tileSize}px Arcade, monospace`
            this.ctx.fillStyle = '#fff'
            this.ctx.textBaseline = 'middle'
            this.ctx.textAlign = 'center'
            this.ctx.fillText(menu.title, x + w / 2, y + h / 2 + p)
        }

        for (const button of menu.buttons)
            this.drawButton(button)
    }

    drawButton(button) {
        const x = button.x, y = button.y, w = button.width, h = button.height, r = h / 4

        // border
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = button.focused ? '#eee' : '#333'
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'

        this.ctx.beginPath()
        this.ctx.moveTo(x, y + r)
        this.ctx.quadraticCurveTo(x, y, x + r, y)
        this.ctx.lineTo(x + w - r, y)
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        this.ctx.lineTo(x + w, y + h - r)
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        this.ctx.lineTo(x + r, y + h)
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.stroke()

        // icon
        // TODO

        // text
        if (button.text) {
            this.ctx.font = `${tileSize}px Arcade, monospace`
            this.ctx.fillStyle = button.focused ? '#eee' : '#777'
            this.ctx.textBaseline = 'middle'
            this.ctx.textAlign = 'center'
            this.ctx.fillText(button.text, x + w / 2, y + h / 2 + 1)
        }
    }

    drawGame(game) {
        this.drawMap(game.map)
        this.drawScore(game)
        // TODO fruit
        this.drawActors(game)
    }

    drawMap(map) {
        for (let y = 0; y < tilesY; ++y) {
            for (let x = 0; x < tilesX; ++x) {
                const tile = map.getTile(x, y)
                if (tile == '-' && map.getTile(x + 1, y)) {
                    this.ctx.fillStyle = '#ffb8de'
                    this.ctx.fillRect(x * tileSize, y * tileSize + 5.5, tileSize * 2, 2)
                    ++x
                } else if (tile == '.' || tile == 'o') {
                    this.ctx.fillStyle = '#ffb8ae'
                    this.ctx.translate(tileSize / 2, tileSize / 2)

                    switch (tile) {
                        case '.':
                            this.ctx.fillRect(x * tileSize - 1, y * tileSize - 1, 2, 2)
                            break
                        case 'o':
                            this.ctx.beginPath()
                            this.ctx.arc(x * tileSize, y * tileSize, tileSize / 2, 0, Math.PI * 2)
                            this.ctx.fill()
                            break
                    }

                    this.ctx.translate(-tileSize / 2, -tileSize / 2)
                }
            }
        }

        this.ctx.fillStyle = '#000'
        this.ctx.strokeStyle = map.flash ? '#fff' : '#2121ff'
        this.ctx.lineWidth = 1

        if (!map.canvasPaths) this.generateWallPaths(map)
        for (const path of map.canvasPaths) {
            this.ctx.beginPath()
            this.ctx.moveTo(path[0].x, path[0].y)
            for (const point of path) {
                if (point.cx != undefined)
                    this.ctx.quadraticCurveTo(point.cx, point.cy, point.x, point.y)
                else
                    this.ctx.lineTo(point.x, point.y)
            }
            this.ctx.quadraticCurveTo(path[path.length - 1].x, path[0].y, path[0].x, path[0].y)
            this.ctx.fill()
            this.ctx.stroke()
        }

        if (debug.enabled) {
            this.ctx.fillStyle = '#fff4'
            for (let x = 0; x <= tilesX; ++x)
                this.ctx.fillRect(x * tileSize - 0.5, 0, 1, tilesY * tileSize)
            for (let y = 0; y <= tilesY; ++y)
                this.ctx.fillRect(0, y * tileSize - 0.5, tilesX * tileSize, 1)
        }
    }

    drawActors(game) {
        if (game.eatPauseFrames)
            this.drawEatenPoints(game.player, game.energizer.points)
        else
            this.drawPlayer(game.player)

        const flash = game.energizer.active && game.energizer.doesFlash(game)
        for (const ghost of game.ghosts)
            this.drawGhost(ghost, game.frame, flash)
    }

    drawEatenPoints(player, points) {
        sprites.drawPacmanPoints(this.ctx, player.pos.x, player.pos.y, points, '#3ff')
    }

    drawPlayer(player) {
        let angle = 0
        const frame = Math.floor(player.steps / 2) % 4
        if (frame == 0 || frame == 2) angle = Math.PI /6
        else if (frame == 1) angle = Math.PI / 3
        sprites.drawPacmanSprite(this.ctx, player.pos.x, player.pos.y, player.dir, angle)
    }

    drawGhost(ghost, gameFrame, flash) {
        if (ghost.mode == ghostEaten) return

        const frame = Math.floor(gameFrame / 8) % 2
        const eyesOnly = ghost.mode == ghostGoingHome || ghost.mode == ghostEnteringHome
        sprites.drawGhostSprite(this.ctx, ghost.pos.x, ghost.pos.y, frame, ghost.faceDir, ghost.scared, flash, eyesOnly, ghost.color)

        if (debug.enabled && ghost.target) {
            const offset = tileSize / 2 - 2
            this.ctx.fillStyle = ghost.color
            this.ctx.globalAlpha = 0.5
            this.ctx.fillRect(ghost.target.x * tileSize + offset, ghost.target.y * tileSize + offset, 4, 4)
            this.ctx.globalAlpha = 1
        }
    }

    drawScore(game) {
        this.ctx.font = `${tileSize}px Arcade, monospace`
        this.ctx.textBaseline = 'top'
        this.ctx.fillStyle = '#fff'
        this.ctx.textAlign = 'right'

        this.ctx.fillText('1UP', 6 * tileSize, 0)
        this.ctx.fillText(game.practiceMode ? 'PRACTICE' : 'HIGH SCORE', 19 * tileSize, 0)

        const y = tileSize + 1

        // TODO: player two score
        let score = game.score
        if (score == 0) score = '00'
        this.ctx.fillText(score, 7 * tileSize, y)

        if (!game.practiceMode) {
            let highscore = game.gameMode.highscore
            if (highscore == 0) highscore = '00'
            this.ctx.fillText(highscore, 17 * tileSize, y)
        }
    }

    generateWallPaths(map) {
        function index(x, y) {
            if (x >= -2 && x <= tilesX + 1)
                return y * (tilesX + 4) + x + 2
        }

        let pad
        function pixels(tx, ty, dir) {
            const vec = direction.vectors[dir]

            if (!(index(tx + vec.y, ty - vec.x) in edges))
                pad = map.isWalkable(tx + vec.y, ty - vec.x) ? 5 : 0

            const px = -tileSize / 2 + pad
            const py = tileSize / 2

            const up = Math.cos(direction.angles[dir])
            const right = -Math.sin(direction.angles[dir])

            return {
                x: (px * up - py * right) + (tx + 0.5) * tileSize,
                y: (px * right + py * up) + (ty + 0.5) * tileSize,
            }
        }

        let i = 0
        const visited = {}
        const edges = {}

        for (let y = 0; y < tilesY; ++y) {
            for (let x = -2; x < tilesX + 2; ++x, ++i) {
                if (map.getTile(x, y) == '|' &&
                    (map.getTile(x - 1, y) != '|' ||
                        map.getTile(x + 1, y) != '|' ||
                        map.getTile(x, y - 1) != '|' ||
                        map.getTile(x, y + 1) != '|' ||
                        map.getTile(x - 1, y - 1) != '|' ||
                        map.getTile(x - 1, y + 1) != '|' ||
                        map.getTile(x + 1, y - 1) != '|' ||
                        map.getTile(x + 1, y + 1) != '|')) {
                    edges[i] = true
                }
            }
        }

        i = 0
        const paths = []

        for (let y = 0; y < tilesY; ++y) {
            for (let x = -2; x < tilesX + 2; ++x, ++i) {
                if (i in edges && !(i in visited)) {
                    let tx = x, ty = y

                    visited[i] = true

                    let dir
                    if (index(tx + 1, ty) in edges) dir = direction.right
                    else if (index(tx, ty + 1) in edges) dir = direction.down
                    else throw `1x1 tile at (${tx}, ${ty})`

                    let vec = direction.vectors[dir]
                    tx += vec.x
                    ty += vec.y

                    const startX = tx
                    const startY = ty
                    const startDir = dir

                    let path = [], turn
                    while (true) {
                        visited[index(tx, ty)] = true

                        let point = pixels(tx, ty, dir)

                        if (turn) {
                            const lastPoint = path[path.length - 1]
                            if (vec.x == 0) {
                                point.cx = point.x
                                point.cy = lastPoint.y
                            } else {
                                point.cx = lastPoint.x
                                point.cy = point.y
                            }
                        }

                        path.push(point)

                        turn = false
                        if (index(tx + vec.y, ty - vec.x) in edges) {
                            dir = direction.rotateLeft(dir)
                            turn = true
                        }
                        else if (index(tx + vec.x, ty + vec.y) in edges) { }
                        else if (index(tx - vec.y, ty + vec.x) in edges) {
                            dir = direction.rotateRight(dir)
                            turn = true
                        }
                        else {
                            path.push(pixels(tx + vec.x, ty + vec.y, dir))
                            dir = direction.reverse(dir)
                            path.push(pixels(tx, ty, dir))
                        }

                        vec = direction.vectors[dir]
                        tx += vec.x;
                        ty += vec.y;

                        if (tx == startX && ty == startY && dir == startDir) {
                            paths.push(path)
                            break
                        }
                    }
                }
            }
        }

        map.canvasPaths = paths
    }

    scaleCanvas(factor) {
        this.canvas.width *= factor
        this.canvas.height *= factor
        this.canvasScale *= factor
        this.ctx.scale(this.canvasScale, this.canvasScale)
    }

    clientToContextCoords(x, y) {
        return {
            x: x / this.canvasScale - margin,
            y: y / this.canvasScale - margin
        }
    }

}
