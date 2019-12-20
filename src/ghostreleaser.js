import { ghostPacingHome } from './ghost.js'

const countPersonal = 0
const countGlobal = 1

const personalDotLimits = [
    () => 0,
    () => 0,
    level => level == 1 ? 30 : 0,
    level => level == 1 ? 60 : (level == 2 ? 50 : 0)
]

const globalDotLimits = [
    0,
    7,
    17,
    23
]

const timeoutLimit = level => level < 5 ? 4 * 60 : 3 * 60

export class GhostReleaser {

    mode = countPersonal
    globalCount = 0
    ghostCounts = [0, 0, 0, 0]
    lastFrame = 0

    // todo on new level

    update(game) {
        switch (this.mode) {
            case countPersonal:
                for (let i = 1; i < 4; ++i) {
                    const ghost = game.ghosts[i]
                    if (ghost.mode == ghostPacingHome) {
                        if (this.ghostCounts[i] >= personalDotLimits[i](game.level)) {
                            ghost.shouldLeaveHome = true
                            return
                        }
                        break
                    }
                }
                break

            case countGlobal:
                for (let i = 1; i < 4; ++i) {
                    const ghost = game.ghosts[i]
                    if (this.globalCount == globalDotLimits[i] && ghost.mode == ghostPacingHome) {
                        ghost.shouldLeaveHome = true
                        if (i == 3) {
                            mode = countPersonal
                            globalCount = 0
                        }
                        return
                    }
                }
                break
        }

        if (game.frame - this.lastFrame > timeoutLimit(game.level)) {
            this.lastFrame = game.frame
            for (let i = 1; i < 4; ++i) {
                const ghost = game.ghosts[i];
                if (ghost.mode == ghostPacingHome) {
                    ghost.shouldLeaveHome = true
                    break
                }
            }
        }
    }

    eatDot(game) {
        this.lastFrame = game.frame

        if (this.mode == countGlobal) {
            ++this.globalCount
        } else {
            for (let i = 1; i < 4; ++i) {
                if (game.ghosts[i].mode == ghostPacingHome) {
                    ++this.ghostCounts[i]
                    break
                }
            }
        }
    }

}

export default GhostReleaser
