import { extractExtendedFeaturesTF, getPossibleDirs } from './features.js'

import tfjs from '../tfjs.js'
const tf = tfjs.tf

export function chooseAction(model, game, epsilon, frames, history) {
    const state = extractExtendedFeaturesTF(game)
    const dirs = getPossibleDirs(game)

    tf.dispose(frames.shift())
    while (frames.length < history - 1)
        frames.push(state.clone())
    frames.push(state.clone())

    const stateHistory = tf.concat(frames, 1)

    let action
    if (Math.random() < (epsilon || 0)) {
        action = dirs[Math.floor(Math.random() * dirs.length)]
    } else {
        action = tf.tidy(() => {
            const prediction = model.predictOnBatch(stateHistory)
            // prediction.print()
            // prediction.pow(2).sum(1).print()
            return prediction.argMax(1).dataSync()[0]
        })
    }

    return { state: stateHistory, action: action }
}
