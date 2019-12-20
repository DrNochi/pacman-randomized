export const up = 0
export const left = 1
export const down = 2
export const right = 3
export const stop = 4

export const vectors = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
]

export const angles = [
    0,
    Math.PI * 0.5,
    Math.PI,
    Math.PI * 1.5,
    0
]

export function rotateLeft(direction) {
    return direction == stop ? stop : (direction + 1) % 4
}

export function rotateRight(direction) {
    return direction == stop ? stop : (direction + 3) % 4
}

export function reverse(direction) {
    return direction == stop ? stop : (direction + 2) % 4
}

export function rotateVectorLeft(vector) {
    return { x: -vector.y, y: vector.x }
}

export function rotateVectorRight(vector) {
    return { x: vector.y, y: -vector.x }
}

export function reverseVector(vector) {
    return { x: -vector.x, y: -vector.y }
}

export function turnTowardsTarget(target, possibilities) {
    let bestDir = stop
    let minDist = Infinity

    for (const next of possibilities) {
        const dx = target.x - next.x
        const dy = target.y - next.y
        const dist = dx * dx + dy * dy
        if (dist < minDist) {
            bestDir = next.dir
            minDist = dist
        }
    }

    return bestDir
}
