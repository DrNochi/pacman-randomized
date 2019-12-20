import { extractSimpleFeatures, getPossibleDirs } from './features.js'
import * as direction from '../direction.js'

export function chooseAction(Q, game, epsilon) {
    const features = extractSimpleFeatures(game)
    const possibleDirs = getPossibleDirs(game)

    if (Math.random() < epsilon)
        return { state: features, action: possibleDirs[Math.floor(Math.random() * possibleDirs.length)] }

    let bestValue = -Infinity
    let bestDir = direction.stop
    for (const dir of possibleDirs) {
        const value = Q[JSON.stringify({ state: features, action: dir })] || 0
        if (value > bestValue) {
            bestValue = value
            bestDir = dir
        }
    }

    return { state: features, action: bestDir }
}

export function updateQ(Q, replayBuffer, game, alpha, gamma) {
    let lastScore = game.score
    let lastValue = game.map.dots ? -200 : 200
    while (replayBuffer.length) {
        const replay = replayBuffer.pop()
        const entry = JSON.stringify(replay.entry)

        const reward = lastScore - replay.score

        let value = Q[entry] || 0
        value *= 1 - alpha
        value += alpha * (reward + gamma * lastValue)
        Q[entry] = value

        console.log(value)

        let bestValue = -Infinity
        for (const dir of getPossibleDirs(game)) {
            const value = Q[JSON.stringify({ state: replay.entry.state, action: dir })] || 0
            if (value > bestValue) {
                bestValue = value
            }
        }

        lastScore = replay.score
        lastValue = bestValue
    }

    console.log(`Score: ${game.score}`)
}
