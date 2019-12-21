import { extractSimpleFeaturesTF, getPossibleDirs } from './features.js'

import tfjs from '../tfjs.js'
const tf = tfjs.tf

export function chooseAction(model, game, epsilon) {
    const state = extractSimpleFeaturesTF(game)
    const dirs = getPossibleDirs(game)

    let action
    if (Math.random() < (epsilon || 0)) {
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
