// import './src/config/debug.js'

import Game from './src/game.js'
import { gamePacMan } from './src/gamemodes.js'
import { updateQ, chooseAction } from './src/ai/qbellman.js'
import { introspect } from './src/ai/introspection.js'

const EPSILON = 0.1
const ALPHA = 0.5
const GAMMA = 0.8

import fs from 'fs'
const qFile = 'data/qbellman.json'
const Q = {}
// const Q = fs.existsSync(qFile) && JSON.parse(fs.readFileSync(qFile)) || {}

import process from 'process'
process.on('SIGINT', () => {
    console.log('Saving Q table...')
    fs.writeFileSync(qFile, JSON.stringify(Q))
    console.log('Finished. Exiting...')
    process.exit(0)
})

async function playGame() {
    const replayBuffer = []
    const game = new Game(gamePacMan)
    const pseudoExecutive = {
        data: { game: game },
        switchState: function () { this.running = false },
        running: true
    }

    let last
    while (pseudoExecutive.running) {
        // const now = new Date().getTime()
        // last = last || now
        // const duration = now - last
        // const fps = 1000 / duration
        // console.log(`Frame period: ${duration.toFixed(2)}ms - FPS: ${fps.toFixed(2)}`)
        // last = now

        if (game.frame % 4 == 0) {
            const entry = chooseAction(Q, game, EPSILON)
            replayBuffer.push({ entry: entry, score: game.score })
            game.player.inputDir = entry.action
            await introspect(game, entry.state, `Action: ${entry.action}`, `Score ${game.score}`)
        }

        game.update(pseudoExecutive)
    }

    await new Promise(res => setTimeout(res, 1000))

    updateQ(Q, replayBuffer, game, ALPHA, GAMMA)

    await new Promise(res => setTimeout(res, 1000))

    setImmediate(playGame)
}

setImmediate(playGame)
