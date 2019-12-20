import Player from './player.js'
import Ghost, { ghostPacingHome, ghostLeavingHome, ghostGoingHome, ghostEnteringHome, ghostOutside } from './ghost.js'
import GhostReleaser from './ghostreleaser.js'
import GhostCommander from './ghostcommander.js'
import Energizer from './energizer.js'
import highscores from './highscores.js'
import { homeState } from './states.js'
import { mapgen } from './mapgen.js'
import * as directions from './direction.js'
import * as targets from './targets.js'
import debug from './debug.js'

export class Game {

    practiceMode = false
    turboMode = false

    level = 1 // todo levels
    score = 0
    extraLives = 0 // todo lives

    ghostReleaser = new GhostReleaser()
    ghostCommander = new GhostCommander()
    energizer = new Energizer()

    player = new Player()
    ghosts = []

    frame = 0
    eatPauseFrames = 0

    constructor(gameMode, forceMapgen, playerAi) {
        this.gameMode = gameMode // todo gamemode

        this.map = forceMapgen ? mapgen() : gameMode.getMap(this.level)

        this.player.pos = { x: 14 * 8, y: 26.5 * 8}
        this.player.dir = directions.left
        this.player.agent = playerAi

        const blinky = new Ghost({ x: 14 * 8, y: 14.5 * 8 }, directions.left, ghostOutside)
        blinky.scatterTarget = { x: 25, y: 0 }
        blinky.pickTarget = targets.targetPlayer
        blinky.color = '#f00'
        this.ghosts.push(blinky)

        const pinky = new Ghost({ x: 14 * 8, y: 17.5 * 8 }, directions.down, ghostPacingHome)
        pinky.scatterTarget = { x: 2, y: 0 }
        pinky.pickTarget = targets.targetAheadPlayer
        pinky.color = '#ffb8ff'
        this.ghosts.push(pinky)

        const inky = new Ghost({ x: 12 * 8, y: 17.5 * 8 }, directions.up, ghostPacingHome)
        inky.scatterTarget = { x: 27, y: 35 }
        inky.pickTarget = targets.targetOppositeFactory(blinky)
        inky.color = '#0ff'
        this.ghosts.push(inky)

        const clyde = new Ghost({ x: 16 * 8, y: 17.5 * 8 }, directions.up, ghostPacingHome)
        clyde.scatterTarget = { x: 0, y: 35 }
        clyde.pickTarget = targets.targetPlayerFeintFactory(clyde.scatterTarget, 64)
        clyde.color = '#ffb851'
        this.ghosts.push(clyde)
    }

    update(executive) {
        if (this.eatPauseFrames) {
            for (let step = 0; step < 2; ++step) {
                for (const ghost of this.ghosts) {
                    if (ghost.mode == ghostGoingHome || ghost.mode == ghostEnteringHome) {
                        if (step < ghost.getStepSize(this))
                            ghost.step(this)
                    }
                }
            }

            --this.eatPauseFrames
            return
        }

        this.player.update()
        for (const ghost of this.ghosts)
            ghost.update()

        this.ghostReleaser.update(this)
        this.ghostCommander.update(this)
        this.energizer.update(this)

        // todo fruit
        // todo elroy

        for (let step = 0; step < 2; ++step) {
            if (step < this.player.getStepSize(this))
                this.player.step(this)

            if (!this.map.dots) {
                executive.switchState(homeState, 60) // todo finishState
                break
            }

            if (this.checkCollision(executive)) break
            for (const ghost of this.ghosts) {
                if (step < ghost.getStepSize(this))
                    ghost.step(this)
            }
            if (this.checkCollision(executive)) break
        }

        ++this.frame
    }

    checkCollision(executive) {
        const playerTile = this.player.tile
        for (const ghost of this.ghosts) {
            const ghostTile = ghost.tile
            if (playerTile.x == ghostTile.x && playerTile.y == ghostTile.y && ghost.mode == ghostOutside) {
                if (ghost.scared) {
                    this.energizer.eatGhost()
                    this.addScore(this.energizer.points)
                    this.eatPauseFrames = 60

                    ghost.eaten()
                } else {
                    if (debug.enabled) console.log('dead')
                    else executive.switchState(homeState, 60) // todo deadState
                }

                return true
            }
        }
    }

    addScore(points) {
        if (this.score < 10000 && this.score + points >= 10000)
            ++this.extraLives

        this.score += points

        if (!this.practiceMode) {
            if (this.score > this.highscore)
                this.highscore = this.score
        }
    }

    get highscore() {
        return this.turboMode
            ? this.gameMode.highscoreTurbo
            : this.gameMode.highscore
    }

    set highscore(score) {
        if (this.turboMode) {
            this.gameMode.highscoreTurbo = score
            highscores.save(`${this.gameMode.name}_highscoreTurbo`, score)
        } else {
            this.gameMode.highscore = score
            highscores.save(`${this.gameMode.name}_highscore`, score)
        }
    }

}

export default Game
