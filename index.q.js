// import './src/config/debug.js'

import Game from './src/game.js'
import { gamePacMan } from './src/gamemodes.js'
import { constructQ, updateQ, chooseAction } from './src/ai/qlearning.js'
import { introspect } from './src/ai/introspection.js'

import fs from 'fs'
const qFile = 'data/q.json'
const Q = {}
// const Q = fs.existsSync(qFile) && JSON.parse(fs.readFileSync(qFile)) || {}
// const Q = constructQ()

import process from 'process'
process.on('SIGINT', () => {
    console.log('Saving Q table...')
    fs.writeFileSync(qFile, JSON.stringify(Q))
    console.log('Finished. Exiting...')
    process.exit(0)
})

let bestGameScore = 0
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

        const entry = chooseAction(Q, game)

        replayBuffer.push({ entry: entry, score: game.score })

        game.player.inputDir = entry.action
        game.update(pseudoExecutive)

        await introspect(game, entry.state, `Action: ${entry.action}`, `Score ${game.score}`)
    }

    await new Promise(res => setTimeout(res, 1000))

    bestGameScore = updateQ(Q, replayBuffer, game, bestGameScore)

    await new Promise(res => setTimeout(res, 1000))

    setImmediate(playGame)
}

setImmediate(playGame)
