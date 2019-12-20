const durations = [6, 5, 4, 3, 2, 5, 2, 2, 1, 5, 2, 1, 1, 3, 1, 1, 0, 1]
const duration = level => level <= 18 ? 60 * durations[level - 1] : 0

const numFlashes = [5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 3, 3, 5, 3, 3, 0, 3]
const flashes = level => level <= 18 ? numFlashes[level - 1] : 0

export class Energizer {

    active = false

    update(game) {
        if (this.active && game.frame - this.start == duration(game.level))
            this.reset(game)
    }

    activate(game) {
        if (duration(game.level)) {
            this.active = true
            this.start = game.frame
            this.points = 100

            for (const ghost of game.ghosts)
                ghost.scare()
        }
    }

    reset(game) {
        this.active = false

        for (const ghost of game.ghosts)
            ghost.scared = false
    }

    eatGhost(game) {
        this.points *= 2
    }

    doesFlash(game) {
        const flash = Math.floor((duration(game.level) - (game.frame - this.start)) / 14)
        return (flash <= 2 * flashes(game.level) - 1) ? (flash % 2 == 0) : false
    }

}

export default Energizer
