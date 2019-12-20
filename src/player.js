import Actor, { stepPlayer, stepPlayerEnergized } from './actor.js'
import * as direction from './direction.js'

export class Player extends Actor {

    inputDir = direction.stop
    eatPauseFrames = 0

    update() {
        if (this.eatPauseFrames) --this.eatPauseFrames
    }

    step(game) {
        if (this.eatPauseFrames) return

        super.step(game)

        const tilePos = this.tile
        const tile = game.map.getTile(tilePos.x, tilePos.y)

        if (tile == '.' || tile == 'o') {
            if (!game.turboMode) this.eatPauseFrames = (tile == '.' ? 1 : 3) + 1

            // todo notify
            game.map.eatDot(tilePos.x, tilePos.y)
            game.ghostReleaser.eatDot(game)

            game.addScore(tile == '.' ? 10 : 50)

            if (tile == 'o') game.energizer.activate(game)
        }
    }

    steer(game) {
        const tile = this.tile
        if (this.inputDir != direction.stop) {
            const vec = direction.vectors[this.inputDir]
            if (game.map.isWalkable(tile.x + vec.x, tile.y + vec.y)) {
                this.dir = this.inputDir
                this.inputDir = direction.stop
                this.override = true
            }
        } else {
            const vec = direction.vectors[this.dir]
            this.override = this.override && game.map.isWalkable(tile.x + vec.x, tile.y + vec.y)
            if (!this.override && this.agent) this.dir = this.agent.chooseAction(game)
        }
    }

    getStepSize(game) {
        return game.turboMode ? 2 : super.getStepSize(game)
    }

    getStepPattern(game) {
        return game.energizer.active ? stepPlayerEnergized : stepPlayer
    }

}

export default Player
