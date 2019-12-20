// import './src/config/debug.js'

import Game from './src/game.js'
import { tilesX, tilesY, tileSize } from './src/map.js'
import { gamePacMan } from './src/gamemodes.js'
import { introspect } from './src/ai/introspection.js'
import * as direction from './src/direction.js'

import tf from '@tensorflow/tfjs-node-gpu'

const channels = 5
const history = 5
const frameInputShape = [channels, tilesY, tilesX]
const inputShape = [channels * history, tilesY, tilesX]


let model = tf.sequential({
    layers: [
        // tf.layers.input({ shape: inputShape }),
        tf.layers.conv2d({ kernelSize: 5, filters: 32, padding: 'same', activation: 'relu', dataFormat: 'channelsFirst', inputShape: inputShape }),
        tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2], dataFormat: 'channelsFirst' }),
        tf.layers.conv2d({ kernelSize: 5, filters: 32, padding: 'same', activation: 'relu', dataFormat: 'channelsFirst' }),
        // tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2], dataFormat: 'channelsFirst' }),
        tf.layers.conv2d({ kernelSize: 4, filters: 64, padding: 'same', activation: 'relu', dataFormat: 'channelsFirst' }),
        // tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2], dataFormat: 'channelsFirst' }),
        tf.layers.conv2d({ kernelSize: 3, filters: 64, padding: 'same', activation: 'relu', dataFormat: 'channelsFirst' }),
        tf.layers.conv2d({ kernelSize: 1, filters: 1, padding: 'same', activation: 'relu', dataFormat: 'channelsFirst' }),
        tf.layers.flatten({ dataFormat: 'channelsFirst' }),
        tf.layers.dense({ units: 512, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
    ]
})

function extractFeatures(game) {
    return tf.tidy(() => {
        const state = tf.buffer(frameInputShape, 'bool')

        for (let x = 0; x < tilesX; ++x) {
            for (let y = 0; y < tilesY; ++y) {
                const tile = game.map.getTile(x, y)
                state.set(game.map.isWalkable(x, y), 0, y, x)
                state.set(tile == '.' || tile == 'o', 1, y, x)
                state.set(game.energizer.active, 4, y, x)
            }
        }

        for (const ghost of game.ghosts) {
            const tile = ghost.tile
            state.set(1, 2, tile.y, tile.x)
        }

        const tile = game.player.tile
        state.set(1, 3, tile.y, tile.x)

        return state.toTensor().expandDims()
    })
}

function chooseAction(game, frames) {
    const frameState = extractFeatures(game)
    tf.dispose(frames.shift())
    while (frames.length < history - 1)
        frames.push(frameState.clone())
    frames.push(frameState)

    return tf.tidy(() => {
        const state = tf.concat(frames, 1)
        const prediction = model.predictOnBatch(state)

        prediction.pow(2).sum(1).print()

        let sums = prediction
        sums = prediction.pow(3)
        sums = sums.div(sums.sum(1))
        sums = sums.cumsum(1)
        sums = sums.arraySync()[0]
        const random = Math.random()
        for (let i = 0; i < 4; ++i)
            if (random < sums[i])
                return { state: state, action: i }
    })
}

import process from 'process'
process.on('SIGINT', async () => {
    await model.save('file://./data/policy.nn')
    console.log('Finished. Exiting...')
    process.exit(0)
})

let bestGameScore = 0
async function playGame() {
    const frames = []
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

        const tilePixel = game.player.tilePixel
        if (tilePixel.x == tileSize / 2 && tilePixel.y == tileSize / 2) {
            const entry = chooseAction(game, frames)

            const tile = game.player.tile
            const vec = direction.vectors[entry.action]
            const cvec = direction.vectors[game.player.dir]
            const valid = game.map.isWalkable(tile.x + vec.x, tile.y + vec.y)
            const cvalid = game.map.isWalkable(tile.x + cvec.x, tile.y + cvec.y)
            const reverse = entry.action == direction.reverse(game.player.dir)
            replayBuffer.push({ entry: entry, valid: valid, reverse: reverse, score: game.score })
            game.player.inputDir = entry.action
            // game.player.inputDir = valid
            //     ? (!reverse
            //         ? entry.action
            //         : (cvalid ? direction.stop : entry.action))
            //     : (cvalid ? direction.stop : direction.reverse(entry.action))

            await introspect(game, entry.state, `Action: ${entry.action}`, `Score ${game.score}`)
        }

        game.update(pseudoExecutive)
    }

    // await new Promise(res => setTimeout(res, 1000))

    let lastScore = game.score + (game.map.dots ? -100 : 100)
    let totalReward = 0 // lastScore - bestGameScore

    const states = []

    const trainingData = tf.tidy(() => {
        const actions = []

        while (replayBuffer.length) {
            const replay = replayBuffer.pop()

            states.push(replay.entry.state)

            const reward = lastScore - replay.score
            totalReward = reward + 0.8 * totalReward
            lastScore = replay.score

            const rewards = [0, 0, 0, 0]
            const incentive = replay.valid || totalReward < -1 ? totalReward / 10 : -1 // totalReward < -10 ? -1 : totalReward > 10 ? 1 : (totalReward / 10)
            rewards[replay.entry.action] = incentive

            actions.push(tf.tensor(rewards).expandDims())

            console.debug(`Direct: ${reward} - Incentive: ${incentive} - Total: ${totalReward}`)
        }

        console.log(`Score: ${game.score} - Best: ${bestGameScore}`)
        bestGameScore = Math.max(bestGameScore, game.score)

        return [tf.concat(states), tf.concat(actions)]
    })

    tf.dispose(states)
    tf.dispose(frames)

    console.log(await model.trainOnBatch(...trainingData))
    tf.dispose(trainingData)

    console.log(tf.memory())

    setImmediate(playGame)
}

// tf.loadLayersModel('file://./data/policy.nn/model.json')
//     .then(m => {
//         model = m
        model.compile({
            optimizer: tf.train.adam(0.0003),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        })
        model.summary()
        // process.exit()
        setImmediate(playGame)
    // })
