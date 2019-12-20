// import './src/config/debug.js'

import Game from './src/game.js'
import { gamePacMan } from './src/gamemodes.js'
import { tilesX, tilesY, tileSize } from './src/map.js'
import { extractSimpleFeatures, getPossibleDirs } from './src/ai/features.js'
import { introspect } from './src/ai/introspection.js'
import * as direction from './src/direction.js'

import tf from '@tensorflow/tfjs-node-gpu'

const featuresShape = [13]

let model = tf.sequential({
    layers: [
        tf.layers.inputLayer({ inputShape: featuresShape, dtype: 'int32' }),
        tf.layers.dense({ units: 512, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
    ]
})

function extractFeatures(game) {
    const features = extractSimpleFeatures(game)
    const tile = game.player.tile

    const state = tf.buffer(featuresShape, 'int32')
    state.set(game.map.isWalkable(tile.x, tile.y - 1), 0)
    state.set(game.map.isWalkable(tile.x - 1, tile.y), 1)
    state.set(game.map.isWalkable(tile.x, tile.y + 1), 2)
    state.set(game.map.isWalkable(tile.x + 1, tile.y), 3)
    state.set(features['ghost-top'], 4)
    state.set(features['ghost-left'], 5)
    state.set(features['ghost-bottom'], 6)
    state.set(features['ghost-right'], 7)
    state.set(features['food-top'], 8)
    state.set(features['food-left'], 9)
    state.set(features['food-bottom'], 10)
    state.set(features['food-right'], 11)
    state.set(features['scared-ghosts'], 12)

    return tf.tidy(() => state.toTensor().expandDims())
}

function chooseAction(game) {
    const state = extractFeatures(game)

    let action
    if (Math.random() < 0.1) {
        const dirs = getPossibleDirs(game)
        action = dirs[Math.floor(Math.random() * dirs.length)]
    } else {
        action = tf.tidy(() => {
            const prediction = model.predictOnBatch(state)
            // prediction.print()
            // prediction.pow(2).sum(1).print()
            return prediction.argMax(1).dataSync()[0]
        })
    }

    return { state: state, action: action }
}

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
            entry = chooseAction(game)
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
