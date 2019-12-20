export const ghostChase = 0
export const ghostScatter = 1

let t
const commands = [{}, {}, {}]
// level 1
commands[0][t = 7 * 60] = ghostChase
commands[0][t += 20 * 60] = ghostScatter
commands[0][t += 7 * 60] = ghostChase
commands[0][t += 20 * 60] = ghostScatter
commands[0][t += 5 * 60] = ghostChase
commands[0][t += 20 * 60] = ghostScatter
commands[0][t += 5 * 60] = ghostChase
// level 2-4
commands[1][t = 7 * 60] = ghostChase
commands[1][t += 20 * 60] = ghostScatter
commands[1][t += 7 * 60] = ghostChase
commands[1][t += 20 * 60] = ghostScatter
commands[1][t += 5 * 60] = ghostChase
commands[1][t += 1033 * 60] = ghostScatter
commands[1][t += 1] = ghostChase
// level 5+
commands[2][t = 5 * 60] = ghostChase
commands[2][t += 20 * 60] = ghostScatter
commands[2][t += 5 * 60] = ghostChase
commands[2][t += 20 * 60] = ghostScatter
commands[2][t += 5 * 60] = ghostChase
commands[2][t += 1037 * 60] = ghostScatter
commands[2][t += 1] = ghostChase

export class GhostCommander {

    command = ghostScatter
    frame = 0

    getNewCommand(level) {
        let i
        if (level == 1) i = 0
        else if (level < 5) i = 1
        else i = 2
        return commands[level][this.frame]
    }

    update(game) {
        if (!game.energizer.active) {
            const next = this.getNewCommand(game.level)
            if (next != undefined) {
                this.command = next

                for (const ghost of game.ghosts)
                    ghost.shouldReverse = true
            }

            ++this.frame
        }
    }

}

export default GhostCommander
