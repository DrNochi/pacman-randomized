import Actor, { stepGhost, stepGhostFrightened, stepGhostTunnel, stepElroy1, stepElroy2 } from './actor.js'
import { doormatTile, doormatPixel, tileSize } from './map.js'
import { ghostScatter } from './ghostcommander.js'
import * as direction from './direction.js'

export const ghostOutside = 0
export const ghostEaten = 1
export const ghostGoingHome = 2
export const ghostEnteringHome = 3
export const ghostPacingHome = 4
export const ghostLeavingHome = 5

const pacingTop = (doormatTile.y + 3) * tileSize
const pacingBottom = pacingTop + tileSize

export class Ghost extends Actor {

    mode = ghostOutside
    faceDir = direction.stop
    scared = false

    constructor(pos, dir, mode) {
        super()
        this.pos = this.startPos = pos
        this.dir = this.faceDir = dir
        this.mode = this.startMode = mode
    }

    scare() {
        this.shouldReverse = true

        if (this.mode != ghostGoingHome && this.mode != ghostEnteringHome)
            this.scared = true
    }

    eaten() {
        this.mode = ghostEaten
        this.scared = false
        this.target = null
    }

    update() {
        if (this.mode == ghostEaten)
            this.mode = ghostGoingHome
    }

    steerHome() {
        switch (this.mode) {
            case ghostGoingHome:
                const tile = this.tile
                if (tile.x == doormatTile.x && tile.y == doormatTile.y) {
                    this.faceDir = direction.down

                    if (this.pos.x == doormatPixel.x) {
                        this.mode = ghostEnteringHome
                        this.dir = direction.down
                    } else {
                        this.dir = direction.left
                    }
                }
                break

            case ghostEnteringHome:
                if (this.pos.y == pacingBottom) {
                    if (this.pos.x == this.startPos.x) {
                        this.mode = this.startMode || ghostLeavingHome
                        this.dir = direction.up
                        this.target = null
                    } else {
                        this.dir = this.pos.x < this.startPos.x ? direction.right : direction.left
                    }

                    this.faceDir = this.dir
                }
                break

            case ghostPacingHome:
                if (this.shouldLeaveHome) {
                    this.shouldLeaveHome = false
                    this.mode = ghostLeavingHome
                    if (this.pos.x == doormatPixel.x) this.dir = direction.up
                    else this.dir = this.pos.x < doormatPixel.x ? direction.right : direction.left
                } else {
                    if (this.pos.y == pacingTop) this.dir = direction.down
                    else if (this.pos.y == pacingBottom) this.dir = direction.up
                }
                this.faceDir = this.dir
                break

            case ghostLeavingHome:
                if (this.pos.x == doormatPixel.x) {
                    if (this.pos.y == doormatPixel.y) {
                        this.mode = ghostOutside
                        this.dir = direction.left
                    } else {
                        this.dir = direction.up
                    }

                    this.faceDir = this.dir
                }
                break
        }
    }

    steer(game) {
        this.steerHome()

        if (this.mode != ghostOutside && this.mode != ghostGoingHome)
            return

        const tilePixel = this.tilePixel
        if (tilePixel.x == tileSize / 2 && tilePixel.y == tileSize / 2) {
            if (this.shouldReverse) {
                this.faceDir = direction.reverse(this.dir)
                this.shouldReverse = false
            }

            this.dir = this.faceDir
        } else if (this.dir == direction.up && tilePixel.y == tileSize / 2 - 1
            || this.dir == direction.left && tilePixel.x == tileSize / 2 - 1
            || this.dir == direction.down && tilePixel.y == tileSize / 2 + 1
            || this.dir == direction.right && tilePixel.x == tileSize / 2 + 1) {

            let nextDir
            const tile = this.tile
            const vec = direction.vectors[this.dir]
            const nextTile = { x: tile.x + vec.x, y: tile.y + vec.y }
            const possibleTurns = this.getPossibleTurns(nextTile, game.map)

            if (this.scared) {
                nextDir = possibleTurns[Math.floor(Math.random() * possibleTurns.length)].dir
                this.target = null
            } else {
                if (this.mode == ghostGoingHome) {
                    this.target = doormatTile
                } else if (game.ghostCommander.command == ghostScatter) { // todo elroy
                    this.target= this.scatterTarget // todo random scatter
                } else {
                    this.target = this.pickTarget(game)
                }

                // todo going home
                // todo constraints

                nextDir = direction.turnTowardsTarget(this.target, possibleTurns)
            }

            this.faceDir = nextDir
        }
    }

    getPossibleTurns(tile, map) {
        const possiblities = []
        for (let i = 0; i < 4; ++i) {
            if (i == direction.reverse(this.dir)) continue

            const vec = direction.vectors[i]
            const nextX = tile.x + vec.x
            const nextY = tile.y + vec.y

            if (map.isWalkable(nextX, nextY))
                possiblities.push({ x: nextX, y: nextY, dir: i })
        }

        return possiblities
    }

    getStepSize(game) {
        if (this.mode == ghostGoingHome || this.mode == ghostEnteringHome)
            return 2
        else if (this.mode == ghostPacingHome || this.mode == ghostLeavingHome)
            return super.getStepSize(game, 1)
        return super.getStepSize(game)
    }

    getStepPattern(game) {
        if (this.mode == ghostPacingHome || this.mode == ghostLeavingHome)
            return stepGhostTunnel
        else if (this.scared)
            return stepGhostFrightened
        else
            return stepGhost // todo other speeds
    }

    get onTrack() {
        return this.mode == ghostOutside
    }

}

export default Ghost
