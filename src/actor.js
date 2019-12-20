import { tileSize } from './map.js'
import * as direction from './direction.js'

export const stepPlayer = 0
export const stepGhost = 1
export const stepPlayerEnergized = 2
export const stepGhostFrightened = 3
export const stepGhostTunnel = 4
export const stepElroy1 = 5
export const stepElroy2 = 6

const stepSizes = [
    [ // LEVEL 1
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // pac-man (normal)
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // ghosts (normal)
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1], // pac-man (fright)
        [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1], // ghosts (fright)
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // ghosts (tunnel)
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // elroy 1
        [1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1], // elroy 2
    ],
    [ // LEVELS 2-4
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1], // pac-man (normal)
        [1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1], // ghosts (normal)
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1], // pac-man (fright)
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1], // ghosts (fright)
        [0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1], // ghosts (tunnel)
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1], // elroy 1
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1], // elroy 2
    ],
    [ // LEVELS 5-20
        [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // pac-man (normal)
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1], // ghosts (normal)
        [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // pac-man (fright) (N/A for levels 17, 19 & 20)
        [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], // ghosts (fright)  (N/A for levels 17, 19 & 20)
        [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1], // ghosts (tunnel)
        [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // elroy 1
        [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1], // elroy 2
    ],
    [ // LEVELS 21+
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1], // pac-man (normal)
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1], // ghosts (normal)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // pac-man (fright) N/A
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // ghosts (fright)  N/A
        [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1], // ghosts (tunnel)
        [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // elroy 1
        [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1], // elroy 2
    ]
]

export class Actor {

    pos = { x: 0, y: 0 }
    dir = direction.stop

    steps = 0

    get tile() {
        return {
            x: Math.floor(this.pos.x / tileSize),
            y: Math.floor(this.pos.y / tileSize),
        }
    }

    get tilePixel() {
        return {
            x: this.pos.x % tileSize,
            y: this.pos.y % tileSize,
        }
    }

    getStepSize(game, levelOverride) {
        const level = levelOverride || game.level
        const frame = game.frame % 16
        const pattern = this.getStepPattern(game)

        if (level == 1) return stepSizes[0][pattern][frame]
        else if (level < 5) return stepSizes[1][pattern][frame]
        else if (level < 21) return stepSizes[2][pattern][frame]
        else return stepSizes[3][pattern][frame]
    }

    step(game) {
        this.steer(game) // todo sort out steering

        const tile = this.tile
        const tilePixel = this.tilePixel
        const vec = direction.vectors[this.dir]
        const onTrack = this.onTrack

        if (!onTrack || game.map.isWalkable(tile.x + vec.x, tile.y + vec.y)
            || vec.x && vec.x * tilePixel.x < vec.x * tileSize / 2
            || vec.y && vec.y * tilePixel.y < vec.y * tileSize / 2) {
            this.pos.x += vec.x || onTrack && tileSize / 2 - tilePixel.x
            this.pos.y += vec.y || onTrack && tileSize / 2 - tilePixel.y

            game.map.teleport(this)

            ++this.steps
        }

        // this.steer(game) // todo sort out steering (original)
    }

    get onTrack() { return true }

}

export default Actor
