// import './src/config/debug.js'
import './src/config/tfjs-node-gpu.js'

import Game from './src/game.js'
import { gamePacMan } from './src/gamemodes.js'
import { simpleFeaturesShape } from './src/ai/features.js'
import { chooseAction } from './src/ai/policy.js'
import { introspect } from './src/ai/introspection.js'

import tf from '@tensorflow/tfjs-node-gpu'

let model = tf.sequential({
    layers: [
        tf.layers.inputLayer({ inputShape: simpleFeaturesShape, dtype: 'int32' }),
        tf.layers.dense({ units: 512, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
    ]
})

import process from 'process'
let stopping = false
process.on('SIGINT', async () => {
    stopping = true
    console.log('Saving model...')
    await model.save('file://./data/policy')
    console.log('Finished. Exiting...')
    process.exit(0)
})

let bestGameScore = 0
async function playGame() {
    if (stopping) return

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

        let entry = { state: 'skip', action: 'skip' }

        if (game.frame % 4 == 0) {
            entry = chooseAction(model, game, 0.1)
            replayBuffer.push({ entry: entry, score: game.score })
            game.player.inputDir = entry.action
        }

        await introspect(game, entry.state.toString(), `Action: ${entry.action}`, `Score ${game.score}`)

        game.update(pseudoExecutive)
    }

    const states = []
    const actions = []

    let lastScore = game.score + (game.map.dots ? -100 : 100)
    while (replayBuffer.length) {
        const replay = replayBuffer.pop()
        states.push(replay.entry.state)

        const reward = Math.max(-1, Math.min(lastScore - replay.score, 1))
        const rewards = [0, 0, 0, 0]
        rewards[replay.entry.action] = reward
        actions.push(tf.tidy(() => tf.tensor(rewards).expandDims()))
    }

    const trainingData = [tf.concat(states), tf.concat(actions)]
    console.log(await model.trainOnBatch(...trainingData))
    tf.dispose([states, actions, trainingData])

    console.log(`Score: ${game.score} - Best: ${bestGameScore}`)
    bestGameScore = Math.max(bestGameScore, game.score)

    setImmediate(playGame)
}

tf.loadLayersModel('file://./data/policy/model.json')
    .then(m => {
        model.dispose()
        model = m
model.compile({
    optimizer: tf.train.adam(0.0003),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
})
model.summary()

setImmediate(playGame)
    })
