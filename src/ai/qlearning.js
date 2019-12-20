import { extractSimpleFeatures, getPossibleDirs } from './features.js'
import * as direction from '../direction.js'

export function chooseAction(Q, game) {
    const features = extractSimpleFeatures(game)

    const possibleDirs = getPossibleDirs(game)
    let N = 1
    let Value = 1
    const entries = {}
    for (const dir of possibleDirs) {
        const entry = Q[JSON.stringify({ state: features, action: dir })] || { value: 0, n: 0 }
        entries[dir] = entry
        Value += Math.abs(entry.value)
        N += entry.n
    }

    let bestValue = -Infinity
    let bestDir = [direction.stop]
    for (const dir in entries) {
        const entry = entries[dir]
        const ucb = entry.value / Value + 5 * Math.sqrt(2 * Math.log(N) / (entry.n + 1))
        console.debug(`Dir: ${dir} - UCB: ${ucb}`)
        if (ucb > bestValue) {
            bestValue = ucb
            bestDir = [parseInt(dir)]
        } else if (ucb == bestValue) {
            bestDir.push(parseInt(dir))
        }
    }

    return { state: features, action: bestDir[Math.floor(Math.random() * bestDir.length)] }
}

export function updateQ(Q, replayBuffer, game, bestGameScore) {
    let lastScore = game.score + (game.map.dots ? -200 : 200)
    let totalReward = lastScore - bestGameScore
    while (replayBuffer.length) {
        const replay = replayBuffer.pop()

        let entry = Q[JSON.stringify(replay.entry)]
        if (!entry) entry = Q[JSON.stringify(replay.entry)] = { value: 0, n: 0 }

        const reward = lastScore - replay.score
        const qReward = reward + 0.8 * totalReward
        entry.value += qReward
        totalReward *= 0.8
        totalReward += reward
        lastScore = replay.score

        ++entry.n

        console.debug(`Direct: ${reward} - Q: ${qReward}`)
    }

    console.log(`Score: ${game.score} - Best: ${bestGameScore}`)
    return Math.max(bestGameScore, game.score)
}

export function constructQ() {
    const Q = {}

    const bool = [false, true]
    for (let closeGhosts = 0; closeGhosts <= 4; ++closeGhosts) {
        for (let ghostsTop = 0; ghostsTop <= closeGhosts; ++ghostsTop) {
            for (let ghostsBottom = 0; ghostsBottom <= closeGhosts - ghostsTop; ++ghostsBottom) {
                for (let ghostsLeft = 0; ghostsLeft <= closeGhosts - ghostsTop - ghostsBottom; ++ghostsLeft) {
                    for (let ghostsRight = 0; ghostsRight <= closeGhosts - ghostsTop - ghostsBottom - ghostsLeft; ++ghostsRight) {
                        for (const foodTop of bool) {
                            for (const foodRight of bool) {
                                for (const foodBottom of bool) {
                                    for (const foodLeft of bool) {
                                        for (const scared of bool) {
                                            for (let action = 0; action < 4; ++action) {
                                                let score = 0

                                                const f = scared ? -1 : 1

                                                if (action == 0 && ghostsTop) score -= 100000 * ghostsTop * f
                                                if (action == 1 && ghostsLeft) score -= 100000 * ghostsLeft * f
                                                if (action == 2 && ghostsBottom) score -= 100000 * ghostsBottom * f
                                                if (action == 3 && ghostsRight) score -= 100000 * ghostsRight * f


                                                if (action == 0 && foodTop) score += 10000
                                                if (action == 1 && foodLeft) score += 10000
                                                if (action == 2 && foodBottom) score += 10000
                                                if (action == 3 && foodRight) score += 10000

                                                score -= closeGhosts * 2000 * f
                                                score += (foodTop + foodLeft + foodBottom + foodRight) * 1000

                                                score += action

                                                const state = {
                                                    'close-ghosts': closeGhosts,
                                                    'ghost-top': ghostsTop,
                                                    'ghost-bottom': ghostsBottom,
                                                    'ghost-left': ghostsLeft,
                                                    'ghost-right': ghostsRight,
                                                    // 'closest-food': food.dist,
                                                    'food-top': foodTop,
                                                    'food-bottom': foodBottom,
                                                    'food-left': foodLeft,
                                                    'food-right': foodRight,
                                                    'scared-ghosts': scared,
                                                }

                                                Q[JSON.stringify({ state: state, action: action })] = { value: score, n: 10000 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return Q
}
