import * as direction from './direction.js'

function plotLine(ctx, points, x, y, color) {
    const len = points.length

    if (x) ctx.translate(x, y)

    ctx.beginPath()
    ctx.moveTo(points[0], points[1])
    for (let i = 2; i < len; ++i)
        ctx.lineTo(points[i], points[++i])

    ctx.lineWidth = 1.0
    ctx.lineJoin = ctx.lineCap = 'round'
    if (color) ctx.strokeStyle = color

    ctx.stroke()

    if (x) ctx.translate(-x, -y)
}

function plotOutine(ctx, points, x, y, color) {
    const len = points.length

    if (x) ctx.translate(x, y)

    ctx.beginPath()
    ctx.moveTo(points[0], points[1])
    for (let i = 2; i < len; ++i)
        ctx.lineTo(points[i], points[++i])
    ctx.closePath()

    ctx.lineWidth = 1.0
    ctx.lineJoin = ctx.lineCap = 'round'
    if (color) ctx.strokeStyle = color

    ctx.stroke()

    if (x && y) ctx.translate(-x, -y)
}

function plotSolid(ctx, points, x, y, color) {
    const len = points.length

    if (x) ctx.translate(x, y)

    ctx.beginPath()
    ctx.moveTo(points[0], points[1])
    for (let i = 2; i < len; ++i)
        ctx.lineTo(points[i], points[++i])
    ctx.closePath()

    ctx.lineWidth = 1.0
    ctx.lineJoin = ctx.lineCap = 'round'
    if (color) ctx.fillStyle = ctx.strokeStyle = color

    ctx.fill()
    ctx.stroke()

    if (x) ctx.translate(-x, -y)
}

const ghostFeetPixels = [
    [
        13, 13,
        11, 11,
        9, 13,
        8, 13,
        8, 11,
        5, 11,
        5, 13,
        4, 13,
        2, 11,
        0, 13,
    ],
    [
        13, 12,
        12, 13,
        11, 13,
        9, 11,
        7, 13,
        6, 13,
        4, 11,
        2, 13,
        1, 13,
        0, 12,
    ]
]

const ghostEyeballPixels = [
    0, 1,
    1, 0,
    2, 0,
    3, 1,
    3, 3,
    2, 4,
    1, 4,
    0, 3
]

const ghostMouthPixels = [
    1, 10,
    2, 9,
    3, 9,
    4, 10,
    5, 10,
    6, 9,
    7, 9,
    8, 10,
    9, 10,
    10, 9,
    11, 9,
    12, 10,
]

function drawGhostHead(ctx) {
    ctx.save()
    ctx.translate(0.5, 0)
    ctx.moveTo(0, 6)
    ctx.quadraticCurveTo(1.5, 0, 6.5, 0)
    ctx.quadraticCurveTo(11.5, 0, 13, 6)
    ctx.restore()
}

function drawGhostFeet(ctx, frame) {
    const coords = ghostFeetPixels[frame]

    ctx.save()
    ctx.translate(0.5, 0.5)
    for (let i = 0; i < coords.length; ++i)
        ctx.lineTo(coords[i], coords[++i])
    ctx.restore()
}

function drawGhostEyes(ctx, dir) {
    ctx.save()
    ctx.translate(2, 3)

    // eyeballs
    switch (dir) {
        case direction.left: ctx.translate(-1, 0); break
        case direction.right: ctx.translate(1, 0); break
        case direction.up: ctx.translate(0, -1); break
        case direction.down: ctx.translate(0, 1); break
    }

    plotSolid(ctx, ghostEyeballPixels, 0.5, 0.5, '#fff')
    plotSolid(ctx, ghostEyeballPixels, 6.5, 0.5, '#fff')

    // pupils
    switch (dir) {
        case direction.left: ctx.translate(0, 2); break
        case direction.right: ctx.translate(2, 2); break
        case direction.up: ctx.translate(1, 0); break
        case direction.down: ctx.translate(1, 3); break
    }

    ctx.fillStyle = '#00f'
    ctx.fillRect(0, 0, 2, 2)
    ctx.fillRect(6, 0, 2, 2)

    ctx.restore()
}

function drawScaredGhostFace(ctx, flash) {
    ctx.strokeStyle = ctx.fillStyle = flash ? '#f00' : '#ff0'

    // eyes
    ctx.fillRect(4, 5, 2, 2)
    ctx.fillRect(8, 5, 2, 2)

    // mouth
    plotLine(ctx, ghostMouthPixels, 0.5, 0.5)
}

export function drawGhostSprite(ctx, x, y, frame, dir, scared, flash, eyesOnly, color) {
    ctx.save()
    ctx.translate(x - 7, y - 7)

    if (scared) color = flash ? '#fff' : '#2121ff'

    // body
    if (!eyesOnly) {
        ctx.beginPath()
        drawGhostHead(ctx)
        drawGhostFeet(ctx, frame)
        ctx.closePath()

        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = 0.5
        ctx.strokeStyle = color
        ctx.stroke()

        ctx.lineWidth = 1
        ctx.fillStyle = color
        ctx.fill()
    }

    // face
    if (scared) drawScaredGhostFace(ctx, flash)
    else drawGhostEyes(ctx, dir)

    ctx.restore()
}

const pacmanPointPixels = [
    [
        1, 0,
        2, 0,
        3, 1,
        3, 5,
        2, 6,
        1, 6,
        0, 5,
        0, 1,
    ],
    [
        0, 1,
        1, 0,
        1, 6,
        0, 6,
        2, 6,
    ],
    [
        0, 2,
        0, 1,
        1, 0,
        3, 0,
        4, 1,
        4, 2,
        0, 6,
        4, 6,
    ],
    [
        0, 0,
        4, 0,
        2, 2,
        4, 4,
        4, 5,
        3, 6,
        1, 6,
        0, 5,
    ],
    [
        3, 6,
        3, 0,
        0, 3,
        0, 4,
        4, 4,
    ],
    [
        4, 0,
        0, 0,
        0, 2,
        3, 2,
        4, 3,
        4, 5,
        3, 6,
        1, 6,
        0, 5,
    ],
    [
        3, 0,
        1, 0,
        0, 1,
        0, 5,
        1, 6,
        2, 6,
        3, 5,
        3, 3,
        0, 3,
    ],
    [
        0, 1,
        0, 0,
        4, 0,
        4, 1,
        2, 4,
        2, 6,
    ],
    [
        1, 0,
        3, 0,
        4, 1,
        4, 2,
        3, 3,
        1, 3,
        0, 4,
        0, 5,
        1, 6,
        3, 6,
        4, 5,
        4, 4,
        3, 3,
        1, 3,
        0, 2,
        0, 1,
    ],
]

export function drawPacmanPoints(ctx, x, y, points, color) {
    ctx.save()
    ctx.translate(x + 0.5, y + 0.5)
    ctx.translate(0, -1)

    switch (points) {
        case 100:
            plotLine(ctx, pacmanPointPixels[1], -5, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 200:
            plotLine(ctx, pacmanPointPixels[2], -7, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 300:
            plotLine(ctx, pacmanPointPixels[3], -7, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 400:
            plotLine(ctx, pacmanPointPixels[4], -7, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 500:
            plotLine(ctx, pacmanPointPixels[5], -7, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 700:
            plotLine(ctx, pacmanPointPixels[7], -7, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 800:
            plotOutine(ctx, pacmanPointPixels[8], -7, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 4, -3, color)
            break

        case 1000:
            plotLine(ctx, pacmanPointPixels[1], -8, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -4, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 6, -3, color)
            break

        case 1600:
            plotLine(ctx, [-7, -3, -7, 3], 0, 0, color)
            plotLine(ctx, pacmanPointPixels[6], -5, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 0, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 5, -3, color)
            break

        case 2000:
            plotLine(ctx, pacmanPointPixels[2], -10, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -4, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 6, -3, color)
            break

        case 3000:
            plotLine(ctx, pacmanPointPixels[3], -10, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -4, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 6, -3, color)
            break

        case 5000:
            plotLine(ctx, pacmanPointPixels[5], -10, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], -4, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 1, -3, color)
            plotOutine(ctx, pacmanPointPixels[0], 6, -3, color)
            break
    }

    ctx.restore()
}

const msPacmanPointPixels = {
    0: [
        0, 0,
        2, 0,
        2, 4,
        0, 4,
    ],
    1: [
        1, 0,
        1, 4,
    ],
    2: [
        0, 0,
        2, 0,
        2, 2,
        0, 2,
        0, 4,
        2, 4,
    ],
    5: [
        2, 0,
        0, 0,
        0, 2,
        2, 2,
        2, 4,
        0, 4,
    ],
    7: [
        0, 0,
        2, 0,
        2, 4,
    ],
}

function drawMsPacmanPoints(ctx, x, y, points) {
    const color = '#fff'

    ctx.save()
    ctx.translate(x + 0.5, y + 0.5)

    switch (points) {
        case 100:
            plotLine(ctx, msPacmanPointPixels[1], -5, -5, color)
            plotOutine(ctx, msPacmanPointPixels[0], -1, -2, color)
            plotOutine(ctx, msPacmanPointPixels[0], 3, 1, color)
            break

        case 200:
            plotLine(ctx, msPacmanPointPixels[2], -5, -5, color)
            plotOutine(ctx, msPacmanPointPixels[0], -1, -2, color)
            plotOutine(ctx, msPacmanPointPixels[0], 3, 1, color)
            break

        case 500:
            plotLine(ctx, msPacmanPointPixels[5], -5, -5, color)
            plotOutine(ctx, msPacmanPointPixels[0], -1, -2, color)
            plotOutine(ctx, msPacmanPointPixels[0], 3, 1, color)
            break

        case 700:
            plotLine(ctx, msPacmanPointPixels[7], -5, -5, color)
            plotOutine(ctx, msPacmanPointPixels[0], -1, -2, color)
            plotOutine(ctx, msPacmanPointPixels[0], 3, 1, color)
            break

        case 1000:
            plotLine(ctx, msPacmanPointPixels[1], -7, -7, color)
            plotOutine(ctx, msPacmanPointPixels[0], -3, -4, color)
            plotOutine(ctx, msPacmanPointPixels[0], 1, -1, color)
            plotOutine(ctx, msPacmanPointPixels[0], 5, 2, color)
            break

        case 2000:
            plotLine(ctx, msPacmanPointPixels[2], -7, -7, color)
            plotOutine(ctx, msPacmanPointPixels[0], -3, -4, color)
            plotOutine(ctx, msPacmanPointPixels[0], 1, -1, color)
            plotOutine(ctx, msPacmanPointPixels[0], 5, 2, color)
            break

        case 5000:
            plotLine(ctx, msPacmanPointPixels[5], -7, -7, color)
            plotOutine(ctx, msPacmanPointPixels[0], -3, -4, color)
            plotOutine(ctx, msPacmanPointPixels[0], 1, -1, color)
            plotOutine(ctx, msPacmanPointPixels[0], 5, 2, color)
            break
    }

    ctx.restore()
}

const monsterEyePixels = [
    0, 1,
    1, 0,
    2, 0,
    3, 1,
    3, 3,
    2, 4,
    1, 4,
    0, 3
]

const monsterPupilPixels = [
    0, 0,
    1, 0,
    1, 1,
    0, 1,
]

const monsterRightBodyPixels = [
    -7, -3,
    -3, -7,
    -1, -7,
    -2, -6,
    0, -4,
    3, -7,
    5, -7,
    4, -7,
    3, -6,
    6, -3,
    6, 1,
    5, 3,
    2, 6,
    -4, 6,
    -5, 5,
    -7, 1,
]

const monsterUpDownBodyPixels = [
    [
        -7, -3,
        -4, -6,
        -5, -7,
        -6, -7,
        -4, -7,
        -3, -6,
        -2, -6,
        -1, -5,
        0, -5,
        1, -6,
        2, -6,
        3, -7,
        5, -7,
        4, -7,
        3, -6,
        6, -3,
        6, 1,
        5, 3,
        4, 5,
        3, 6,
        -4, 6,
        -5, 5,
        -6, 3,
        -7, 1,
    ],
    [
        -7, -3,
        -4, -6,
        -5, -7,
        -6, -6,
        -5, -7,
        -4, -7,
        -3, -6,
        -2, -6,
        -1, -5,
        0, -5,
        1, -6,
        2, -6,
        3, -7,
        4, -7,
        5, -6,
        4, -7,
        3, -6,
        6, -3,
        6, 1,
        5, 3,
        4, 5,
        3, 6,
        -4, 6,
        -5, 5,
        -6, 3,
        -7, 1,
    ]
]

const monsterScaredBodyPixels = [
    -6, -2,
    -2, -5,
    -3, -6,
    -5, -6,
    -3, -6,
    -1, -4,
    1, -4,
    3, -6,
    5, -6,
    3, -6,
    2, -5,
    6, -2,
    6, 4,
    5, 6,
    4, 7,
    -4, 7,
    -5, 6,
    -6, 4
]

const monsterRightShoePixels = [
    0, 0,
    3, -3,
    4, -3,
    5, -2,
    5, -1,
    4, 0,
]

const monsterUpShoePixels = [
    [
        -4, 6,
        -3, 5,
        -2, 5,
        -1, 6,
    ],
    [
        0, 6,
        1, 5,
        2, 5,
        3, 6,
    ]
]

const monsterDownShoePixels = [
    [
        0, 6,
        1, 4,
        2, 3,
        3, 3,
        4, 4,
        4, 5,
        3, 6,
    ],
    [
        -1, 6,
        -2, 4,
        -3, 3,
        -4, 3,
        -5, 4,
        -5, 5,
        -4, 6,
    ]
]

function drawMonsterEye(ctx, x, y, dir) {
    ctx.save()
    ctx.translate(x, y)

    // eye
    plotSolid(monsterEyePixels, 0, 0, '#fff')

    // pupil
    switch (dir) {
        case direction.left: ctx.translate(0, 2); break
        case direction.right: ctx.translate(2, 2); break
        case direction.up: ctx.translate(1, 0); break
        case direction.down: ctx.translate(1, 3); break
    }

    plotSolid(monsterPupilPixels, 0, 0, '#00f')

    ctx.restore()
}

function drawMonsterRight(ctx, frame, color) {
    // antenna
    plotLine(ctx, [-1, -7, 0, frame ? -7 : -6], 0, 0, '#fff')
    plotLine([5, -7, 6, frame ? -7 : -6], 0, 0, '#fff')

    // body
    plotSolid(ctx, monsterRightBodyPixels, 0, 0, color)

    // shoes
    if (frame) {
        plotSolid(ctx, monsterRightShoePixels, -4, 6, '#00f')
        plotLine(ctx, [2, 6, 5, 6], 0, 0, '#00f')
    } else {
        plotSolid(ctx, monsterRightShoePixels, 1, 6, '#00f')
        plotLine(ctx, [-4, 6, -1, 6], 0, 0, '#00f')
    }

    // eyes
    drawMonsterRight(ctx, -4, -4, direction.right)
    drawMonsterRight(ctx, 2, -4, direction.right)
}

function drawMonsterUpDownBody(ctx, frame, color) {
    // body
    if (frame) {
        plotLine(ctx, [-6, -6, -7, -5], 0, 0, '#fff')
        plotLine(ctx, [5, -6, 6, -5], 0, 0, '#fff')
    } else {
        plotLine(ctx, [-6, -7, -7, -6], 0, 0, '#fff')
        plotLine(ctx, [5, -7, 6, -6], 0, 0, '#fff')
    }
    plotSolid(ctx, monsterUpDownBodyPixels, 0, 0, color)

}

function drawMonsterUp(ctx, frame, color) {
    drawMonsterUpDownBody(ctx, frame, color)

    // eyes
    drawMonsterEye(ctx, -5, -5, direction.up)
    drawMonsterEye(ctx, 1, -5, direction.up)

    // shoes
    plotSolid(ctx, monsterUpShoePixels[frame], 0, 0, '#00f')
}

function drawMonsterDown(ctx, frame, color) {
    drawMonsterUpDownBody(ctx, frame, color)

    // eyes
    drawMonsterEye(ctx, -5, -4, direction.down)
    drawMonsterEye(ctx, 1, -4, direction.down)

    // shoes
    plotSolid(ctx, monsterDownShoePixels[frame], 0, 0, '#00f')
    if (frame) plotLine(ctx, [1, 6, 3, 6], 0, 0, '#00f')
    else plotLine(ctx, [-4, 6, -2, 6], 0, 0, '#00f')
}

function drawMonsterScared(ctx, frame, faceColor, borderColor) {
    if (frame) {
        plotLine(ctx, [-3, -2, -1, 0], 0, 0, faceColor)
        plotLine(ctx, [-3, 0, -1, -2], 0, 0, faceColor)
        plotLine(ctx, [1, -2, 3, 0], 0, 0, faceColor)
        plotLine(ctx, [1, 0, 3, -2], 0, 0, faceColor)
        plotLine(ctx, [-5, -6, -6, -5], 0, 0, '#fff')
        plotLine(ctx, [5, -6, 6, -5], 0, 0, '#fff')
    } else {
        plotLine(ctx, [-2, -2, -2, 0], 0, 0, faceColor)
        plotLine(ctx, [-3, -1, -1, -1], 0, 0, faceColor)
        plotLine(ctx, [2, -2, 2, 0], 0, 0, faceColor)
        plotLine(ctx, [3, -1, 1, -1], 0, 0, faceColor)
        plotLine(ctx, [-5, -6, -6, -7], 0, 0, '#fff')
        plotLine(ctx, [5, -6, 6, -7], 0, 0, '#fff')
    }

    // body
    plotOutine(ctx, monsterScaredBodyPixels, 0, 0, borderColor)
    plotLine(ctx, [
        -2, 4,
        -1, 3,
        1, 3,
        2, 4
    ], 0, 0, faceColor)
}

function drawMonsterSprite(ctx, x, y, frame, dir, scared, flash, eyesOnly, color) {
    if (eyesOnly) return // invisible

    ctx.save()
    ctx.translate(x + 0.5, y + 0.5)

    if (scared) {
        ctx.translate(0, -1)
        drawMonsterScared(ctx, frame, flash ? '#f00' : '#ff0', flash ? '#fff' : '#00f')
    } else {
        switch (dir) {
            case direction.left:
                ctx.scale(-1, 1)
                ctx.translate(1, 0)
            case direction.right:
                drawMonsterRight(ctx, frame, color)
                break

            case direction.up:
                drawMonsterUp(ctx, frame, color)
                break

            case direction.down:
                drawMonsterDown(ctx, frame, color)
                break
        }
    }

    ctx.restore()
}

const ottoRightEyePixels = [
    -4, -5,
    -3, -6,
    -2, -6,
    -2, -5,
    -3, -4,
    -4, -4,
]

const ottoRightPixels = [
    [
        -5, -4,
        -3, -6,
        2, -6,
        3, -5,
        -1, -3,
        3, -1,
        1, 1,
        1, 3,
        3, 6,
        5, 4,
        6, 4,
        6, 5,
        4, 7,
        2, 7,
        -1, 1,
        -4, 4,
        -3, 6,
        -3, 7,
        -4, 7,
        -6, 5,
        -6, 4,
        -3, 1,
        -5, -1,
    ],
    [
        -5, -4,
        -3, -6,
        1, -6,
        3, -4,
        3, -1,
        1, 1,
        1, 6,
        4, 6,
        4, 7,
        0, 7,
        0, 1,
        -2, 1,
        -4, 3,
        -4, 4,
        -3, 5,
        -3, 6,
        -4, 6,
        -5, 4,
        -5, 3,
        -3, 1,
        -5, -1,
    ],
    [
        -5, -4,
        -3, -6,
        2, -6,
        3, -5,
        -1, -3,
        3, -1,
        1, 1,
        1, 3,
        4, 3,
        4, 4,
        0, 4,
        0, 1,
        -2, 1,
        -2, 6,
        1, 6,
        1, 7,
        -3, 7,
        -3, 1,
        -5, -1,
    ],
    [
        -5, -4,
        -3, -6,
        2, -6,
        -2, -3,
        2, 0,
        1, 1,
        3, 5,
        5, 3,
        6, 3,
        6, 4,
        4, 6,
        2, 6,
        -1, 1,
        -3, 1,
        -3, 6,
        0, 6,
        0, 7,
        -4, 7,
        -4, 2,
        -3, 1,
        -5, -1,
    ],
]

const ottoUpDownEyePixels = [
    [
        -5, -5,
        -4, -6,
        -3, -6,
        -3, -5,
        -4, -4,
        -5, -4,
    ],
    [
        3, -6,
        4, -6,
        5, -5,
        5, -4,
        4, -4,
        3, -5,
    ]
]

const ottoUpDownHeadPixels = [
    -4, -4,
    -2, -6,
    2, -6,
    4, -4,
    4, -1,
    2, 1,
    -2, 1,
    -4, -1,
]

const ottoUpDownLegPixels = [
    [
        1, 0,
        2, 0,
        2, 6,
        4, 6,
        4, 7,
        1, 7,
    ],
    [
        1, 0,
        2, 0,
        2, 4,
        3, 5,
        4, 4,
        5, 4,
        5, 5,
        3, 7,
        2, 7,
        1, 6,
    ]
]

function drawOttoUpDownLeg(ctx, side, xs, y, color) {
    ctx.save()
    ctx.translate(0, y)
    ctx.scale(xs, 1)

    plotSolid(ctx, ottoUpDownLegPixels[side], 0, 0, color)

    ctx.restore()
}

function drawOttoUpDownLegs(ctx, frame, color) {
    switch (frame) {
        case 0:
            drawOttoUpDownLeg(ctx, 0, 0, -1, color)
            drawOttoUpDownLeg(ctx, 1, -2, 1, color)
            break

        case 1:
            drawOttoUpDownLeg(ctx, 0, -2, -1, color)
            drawOttoUpDownLeg(ctx, 1, -2, 1, color)
            break

        case 2:
            drawOttoUpDownLeg(ctx, 1, -2, -1, color)
            drawOttoUpDownLeg(ctx, 0, -0, 1, color)
            break

        case 3:
            drawOttoUpDownLeg(ctx, 1, 0, -1, color)
            drawOttoUpDownLeg(ctx, 0, 0, 1, color)
            break
    }
}

function drawOttoDownMouth(ctx, frame, color) {
    switch (frame) {
        case 0: plotLine(ctx, [-2, -3, 2, -3], 0, 0, color); break
        case 2: plotLine(ctx, [-2, -3, 2, -3], 0, 0, color); break
        case 3: plotLine(ctx, [-2, -3, 0, -5, 2, -3, 0, -1], 0, 0, color); break
    }
}

function drawOttoSprite(ctx, x, y, dir, frame, rotate) {
    ctx.save()
    ctx.translate(x + 0.5, y + 0.5)
    if (rotate) ctx.rotate(rotate)

    ctx.translate(0, -1)

    switch (dir) {
        case direction.left:
            ctx.scale(-1, 1)
        case direction.right:
            plotSolid(ctx, ottoRightPixels[frame], 0, 0, '#ff0')
            plotSolid(ctx, ottoRightEyePixels, 0, 0, '#00f')
            break

        case direction.up:
        case direction.down:
            plotSolid(ctx, ottoUpDownEyePixels, 0, 0, '#00f')
            plotSolid(ctx, ottoUpDownHeadPixels, 0, 0, '#ff0')
            if (dir == direction.down) drawOttoDownMouth(ctx, frame, '#000')
            break
    }

    ctx.restore()
}

const deadOttoPixels = [
    3, -5,
    -1, -5,
    -2, -6,
    -2, -7,
    -1, -8,
    3, -8,
    4, -7,
    4, -6,
]

function drawDeadOttoSprite(ctx, x, y) {
    plotOutline(ctx, deadOttoPixels, x + 2, y, '#f00')
    drawOttoSprite(ctx, x, y, direction.left, 2, Math.PI / 2)
}

export function drawPacmanSprite(ctx, x, y, dir, angle, mouthShift, scale, centerShift, alpha, color, rotate) {
    mouthShift = mouthShift || 0
    centerShift = centerShift || 0
    scale = scale || 1
    alpha = alpha || 1
    color = color || `rgba(255, 255, 0, ${alpha})`

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    if (rotate) ctx.rotate(rotate)

    const d90 = Math.PI / 2
    switch (dir) {
        case direction.up: ctx.rotate(-d90); break
        case direction.down: ctx.rotate(d90); break
        case direction.left: ctx.rotate(2 * d90); break
    }

    // mouth
    ctx.beginPath()
    ctx.moveTo(-3 + mouthShift, 0)

    // head
    ctx.arc(centerShift, 0, 6.5, angle, 2 * Math.PI - angle)
    ctx.closePath()

    ctx.fillStyle = color
    ctx.fill()

    ctx.restore()
}

var drawGiantPacmanSprite = function (ctx, x, y, dir, frame) {
    const color = '#ff0'

    let mouthShift = 0
    let angle = 0
    if (frame == 1) {
        mouthShift = -4
        angle = Math.atan(7 / 14)
    } else if (frame == 2) {
        mouthShift = -2
        angle = Math.atan(13 / 9)
    }

    ctx.save()
    ctx.translate(x, y)

    const d90 = Math.PI / 2
    switch (dir) {
        case direction.up: ctx.rotate(-d90); break
        case direction.down: ctx.rotate(d90); break
        case direction.left: ctx.rotate(2 * d90); break
    }

    // mouth
    ctx.beginPath()
    ctx.moveTo(mouthShift, 0)

    // head
    ctx.arc(0, 0, 16, angle, 2 * Math.PI - angle)
    ctx.closePath()

    ctx.fillStyle = color
    ctx.fill()

    ctx.restore()
}

function drawMsPacmanSprite(ctx, x, y, dir, frame, rotate) {
    let angle = 0

    // body
    if (frame == 1) angle = Math.atan(4 / 5)
    else if (frame == 2) angle = Math.atan(6 / 3)
    drawPacmanSprite(ctx, x, y, dir, angle, 0, 1, 0, 1, '#ff0', rotate)
    if (frame == 1) angle = Math.atan(4 / 8)
    else if (frame == 2) angle = Math.atan(6 / 6)

    ctx.save()
    ctx.translate(x, y)
    if (rotate) ctx.rotate(rotate)

    const d90 = Math.PI / 2
    switch (dir) {
        case direction.up: ctx.rotate(-d90); break
        case direction.down: ctx.rotate(d90); break
        case direction.left: ctx.scale(-1, 1); break
    }

    // bow
    x = -7.5, y = -7.5

    ctx.fillStyle = '#f00'
    ctx.beginPath(); ctx.arc(x + 1, y + 4, 1.25, 0, Math.PI * 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 2, y + 5, 1.25, 0, Math.PI * 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 3, y + 3, 1.25, 0, Math.PI * 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 4, y + 1, 1.25, 0, Math.PI * 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 5, y + 2, 1.25, 0, Math.PI * 2); ctx.closePath(); ctx.fill()

    ctx.fillStyle = '#0031ff'
    ctx.beginPath(); ctx.arc(x + 2.5, y + 3.5, 0.5, 0, Math.PI * 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 3.5, y + 2.5, 0.5, 0, Math.PI * 2); ctx.closePath(); ctx.fill()

    // lips
    ctx.strokeStyle = '#f00'
    ctx.lineWidth = 1.25
    ctx.lineCap = 'round'

    ctx.beginPath()
    if (frame == 0) {
        ctx.moveTo(5, 0)
        ctx.lineTo(6.5, 0)
        ctx.moveTo(6.5, -1.5)
        ctx.lineTo(6.5, 1.5)
    } else {
        const r1 = 7.5
        const r2 = 8.5
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        ctx.moveTo(-3 + r1 * c, r1 * s)
        ctx.lineTo(-3 + r2 * c, r2 * s)
        ctx.moveTo(-3 + r1 * c, -r1 * s)
        ctx.lineTo(-3 + r2 * c, -r2 * s)
    }
    ctx.stroke()

    // mole
    ctx.fillStyle = '#000'

    ctx.beginPath()
    ctx.arc(-3, 2, 0.5, 0, Math.PI * 2)
    ctx.fill()

    // eye
    ctx.strokeStyle = '#000'
    ctx.lineCap = 'round'

    ctx.beginPath()
    if (frame == 0) {
        ctx.moveTo(-2.5, -2)
        ctx.lineTo(-0.5, -2)
    } else {
        const r1 = 0.5
        const r2 = 2.5
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        ctx.moveTo(-3 + r1 * c, -2 - r1 * s)
        ctx.lineTo(-3 + r2 * c, -2 - r2 * s)
    }
    ctx.stroke()

    ctx.restore()
}

function drawCookiemanSprite(ctx, x, y, dir, frame, shake, rotate) {
    let angle = 0

    // body
    if (frame == 1) angle = Math.atan(4 / 5)
    else if (frame == 2) angle = Math.atan(6 / 3)
    drawPacmanSprite(ctx, x, y, dir, angle, 0, 1, 0, 1, '#47b8ff', rotate)
    if (frame == 1) angle = Math.atan(4 / 8)
    else if (frame == 2) angle = Math.atan(6 / 6)

    ctx.save()
    ctx.translate(x, y)
    if (rotate) ctx.rotate(rotate)

    const d90 = Math.PI / 2
    switch (dir) {
        case direction.up: ctx.rotate(-d90); break
        case direction.down: ctx.rotate(d90); break
        case direction.left: ctx.scale(-1, 1); break
    }

    x = -4 // pivot point
    y = -3.5
    const r1 = 3 // distance from pivot of first eye
    const r2 = 6 // distance from pivot of second eye
    angle /= 3 // angle from pivot point
    angle += Math.PI / 8
    const c = Math.cos(angle)
    const s = Math.sin(angle)

    let sx1 = 0 // shift x for first pupil
    let sy1 = 0 // shift y for first pupil
    let sx2 = 0 // shift x for second pupil
    let sy2 = 0 // shift y for second pupil

    const er = 2.1 // eye radius
    const pr = 1 // pupil radius

    if (shake) {
        // TODO: draw pupils separately in atlas
        //      composite the body frame and a random pupil frame when drawing cookie-man

        const a1 = Math.random() * Math.PI * 2
        const a2 = Math.random() * Math.PI * 2
        const r1 = Math.random() * pr
        const r2 = Math.random() * pr

        sx1 = Math.cos(a1) * r1
        sy1 = Math.sin(a1) * r1
        sx2 = Math.cos(a2) * r2
        sy2 = Math.sin(a2) * r2
    }

    // eyes
    ctx.fillStyle = '#fff'

    ctx.beginPath()
    ctx.arc(x + r2 * c, y - r2 * s, er, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x + r1 * c, y - r1 * s, er, 0, Math.PI * 2)
    ctx.fill()

    // pupils
    ctx.fillStyle = '#000'

    ctx.beginPath()
    ctx.arc(x + r2 * c + sx2, y - r2 * s + sy2, pr, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x + r1 * c + sx1, y - r1 * s + sy1, pr, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
}

function drawCherry(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // red fruit
    ctx.lineWidth = 1.0
    ctx.strokeStyle = '#000'
    ctx.fillStyle = '#f00'

    ctx.beginPath()
    ctx.arc(2.5, 2.5, 3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fill()

    // white shine
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#fff'

    ctx.beginPath()
    ctx.moveTo(1, 3)
    ctx.lineTo(2, 4)
    ctx.stroke()

    ctx.restore()
}

function drawCherrySrite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // cherries
    drawCherry(ctx, -6, -1)
    drawCherry(ctx, -1, 1)

    // stems
    ctx.strokeStyle = '#f90'
    ctx.lineJoin = ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-3, 0)
    ctx.bezierCurveTo(-1, -2, 2, -4, 5, -5)
    ctx.lineTo(5, -4)
    ctx.bezierCurveTo(3, -4, 1, 0, 1, 2)
    ctx.stroke()

    ctx.restore()
}

function drawStrawberrySprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // red body
    ctx.fillStyle = '#f00'
    ctx.strokeStyle = '#f00'

    ctx.beginPath()
    ctx.moveTo(-1, -4)
    ctx.bezierCurveTo(-3, -4, -5, -3, -5, -1)
    ctx.bezierCurveTo(-5, 3, -2, 5, 0, 6)
    ctx.bezierCurveTo(3, 5, 5, 2, 5, 0)
    ctx.bezierCurveTo(5, -3, 3, -4, 0, -4)
    ctx.fill()
    ctx.stroke()

    // white spots
    const spots = [
        { x: -4, y: -1 },
        { x: -3, y: 2 },
        { x: -2, y: 0 },
        { x: -1, y: 4 },
        { x: 0, y: 2 },
        { x: 0, y: 0 },
        { x: 2, y: 4 },
        { x: 2, y: -1 },
        { x: 3, y: 1 },
        { x: 4, y: -2 }
    ]

    ctx.fillStyle = '#fff'

    for (const s of spots) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, 0.75, 0, 2 * Math.PI)
        ctx.fill()
    }

    // green leaf
    ctx.strokeStyle = '#0f0'
    ctx.lineJoin = ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(0, -4)
    ctx.lineTo(-3, -4)
    ctx.lineTo(0, -4)
    ctx.lineTo(-2, -3)
    ctx.lineTo(-1, -3)
    ctx.lineTo(0, -4)
    ctx.lineTo(0, -2)
    ctx.lineTo(0, -4)
    ctx.lineTo(1, -3)
    ctx.lineTo(2, -3)
    ctx.lineTo(0, -4)
    ctx.lineTo(3, -4)
    ctx.closePath()
    ctx.stroke()

    // stem
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(0, -4)
    ctx.lineTo(0, -5)
    ctx.stroke()

    ctx.restore()
}

function drawOrangeSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // orange body
    ctx.fillStyle = '#fc3'
    ctx.strokeStyle = '#fc3'

    ctx.beginPath()
    ctx.moveTo(-2, -2)
    ctx.bezierCurveTo(-3, -2, -5, -1, -5, 1)
    ctx.bezierCurveTo(-5, 4, -3, 6, 0, 6)
    ctx.bezierCurveTo(3, 6, 5, 4, 5, 1)
    ctx.bezierCurveTo(5, -1, 3, -2, 2, -2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // stem
    ctx.strokeStyle = '#f90'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(-1, -1)
    ctx.quadraticCurveTo(-1, -2, -2, -2)
    ctx.quadraticCurveTo(-1, -2, -1, -4)
    ctx.quadraticCurveTo(-1, -2, 0, -2)
    ctx.quadraticCurveTo(-1, -2, -1, -1)
    ctx.stroke()

    // green leaf
    ctx.fillStyle = '#0f0'
    ctx.strokeStyle = '#0f0f'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(-0.5, -4)
    ctx.quadraticCurveTo(0, -5, 1, -5)
    ctx.bezierCurveTo(2, -5, 3, -4, 4, -4)
    ctx.bezierCurveTo(3, -4, 3, -3, 2, -3)
    ctx.bezierCurveTo(1, -3, 1, -4, -0.5, -4)
    ctx.stroke()
    ctx.fill()

    ctx.restore()
}

function drawAppleSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // red fruit
    ctx.fillStyle = '#f00'

    ctx.beginPath()
    ctx.moveTo(-2, -3)
    ctx.bezierCurveTo(-2, -4, -3, -4, -4, -4)
    ctx.bezierCurveTo(-5, -4, -6, -3, -6, 0)
    ctx.bezierCurveTo(-6, 3, -4, 6, -2.5, 6)
    ctx.quadraticCurveTo(-1, 6, -1, 5)
    ctx.bezierCurveTo(-1, 6, 0, 6, 1, 6)
    ctx.bezierCurveTo(3, 6, 5, 3, 5, 0)
    ctx.bezierCurveTo(5, -3, 3, -4, 2, -4)
    ctx.quadraticCurveTo(0, -4, 0, -3)
    ctx.closePath()
    ctx.fill()

    // stem
    ctx.strokeStyle = '#f90'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-1, -3)
    ctx.quadraticCurveTo(-1, -5, 0, -5)
    ctx.stroke()

    // shine
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(2, 3)
    ctx.quadraticCurveTo(3, 3, 3, 1)
    ctx.stroke()

    ctx.restore()
}

function drawMelonSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // draw body
    ctx.fillStyle = '#7bf331'

    ctx.beginPath()
    ctx.arc(0, 2, 5.5, 0, Math.PI * 2)
    ctx.fill()

    // draw stem
    ctx.strokeStyle = '#69b4af'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(0, -4)
    ctx.lineTo(0, -5)
    ctx.moveTo(2, -5)
    ctx.quadraticCurveTo(-3, -5, -3, -6)
    ctx.stroke()

    // dark spots
    const spots = [
        0, -2,
        -1, -1,
        -2, 0,
        -3, 1,
        -4, 2,
        -3, 3,
        -2, 4,
        -1, 5,
        -2, 6,
        -3, -1,
        1, 7,
        2, 6,
        3, 5,
        2, 4,
        1, 3,
        0, 2,
        1, 1,
        2, 0,
        3, -1,
        3, 1,
        4, 2,
    ]

    ctx.fillStyle = '#69b4af'
    for (let i = 0, len = spots.length; i < len; ++i) {
        ctx.beginPath()
        ctx.arc(spots[i], spots[++i], 0.65, 0, 2 * Math.PI)
        ctx.fill()
    }

    // white spots
    const whiteSpots = [
        { x: 0, y: -3 },
        { x: -2, y: -1 },
        { x: -4, y: 1 },
        { x: -3, y: 3 },
        { x: 1, y: 0 },
        { x: -1, y: 2 },
        { x: -1, y: 4 },
        { x: 3, y: 2 },
        { x: 1, y: 4 },
    ]

    ctx.fillStyle = '#fff'
    for (const s of whiteSpots) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, 0.65, 0, 2 * Math.PI)
        ctx.fill()
    }

    ctx.restore()
}

function drawGalaxianSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // draw yellow body
    ctx.strokeStyle = ctx.fillStyle = '#fffa36'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(-4, -2)
    ctx.lineTo(4, -2)
    ctx.lineTo(4, -1)
    ctx.lineTo(2, 1)
    ctx.lineTo(1, 0)
    ctx.lineTo(0, 0)
    ctx.lineTo(0, 5)
    ctx.lineTo(0, 0)
    ctx.lineTo(-1, 0)
    ctx.lineTo(-2, 1)
    ctx.lineTo(-4, -1)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // draw red arrow head
    ctx.strokeStyle = ctx.fillStyle = '#f00'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(0, -5)
    ctx.lineTo(-3, -2)
    ctx.lineTo(-2, -2)
    ctx.lineTo(-1, -3)
    ctx.lineTo(0, -3)
    ctx.lineTo(0, -1)
    ctx.lineTo(0, -3)
    ctx.lineTo(1, -3)
    ctx.lineTo(2, -2)
    ctx.lineTo(3, -2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // draw blue wings
    ctx.strokeStyle = '#00f'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(-5, -4)
    ctx.lineTo(-5, -1)
    ctx.lineTo(-2, 2)
    ctx.moveTo(5, -4)
    ctx.lineTo(5, -1)
    ctx.lineTo(2, 2)
    ctx.stroke()

    ctx.restore()
}

function drawBellSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // bell body
    ctx.fillStyle = ctx.strokeStyle = '#fffa37'

    ctx.beginPath()
    ctx.moveTo(-1, -5)
    ctx.bezierCurveTo(-4, -5, -6, 1, -6, 6)
    ctx.lineTo(5, 6)
    ctx.bezierCurveTo(5, 1, 3, -5, 0, -5)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()

    // marks
    ctx.strokeStyle = '#000'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-4, 4)
    ctx.lineTo(-4, 3)
    ctx.moveTo(-3, 1)
    ctx.quadraticCurveTo(-3, -2, -2, -2)
    ctx.moveTo(-1, -4)
    ctx.lineTo(0, -4)
    ctx.stroke()

    // bell bottom
    ctx.fillStyle = '#68b9fc'
    ctx.beginPath()
    ctx.rect(-5.5, 6, 10, 2)
    ctx.fill()

    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.rect(-0.5, 6, 2, 2)
    ctx.fill()

    ctx.restore()
}

function drawKeySprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // draw key metal
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-1, -2)
    ctx.lineTo(-1, 5)
    ctx.moveTo(0, 6)
    ctx.quadraticCurveTo(1, 6, 1, 3)
    ctx.moveTo(1, 4)
    ctx.lineTo(2, 4)
    ctx.moveTo(1, 1)
    ctx.lineTo(1, -2)
    ctx.moveTo(1, 0)
    ctx.lineTo(2, 0)
    ctx.stroke()

    // draw key top
    ctx.strokeStyle = ctx.fillStyle = '#68b9fc'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(0, -6)
    ctx.quadraticCurveTo(-3, -6, -3, -4)
    ctx.lineTo(-3, -2)
    ctx.lineTo(3, -2)
    ctx.lineTo(3, -4)
    ctx.quadraticCurveTo(3, -6, 0, -6)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = '#000'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(1, -5)
    ctx.lineTo(-1, -5)
    ctx.stroke()

    ctx.restore()
}

function drawPretzelSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // bread
    ctx.strokeStyle = '#fc3'
    ctx.lineCap = 'round'
    ctx.lineWidth = 2.0

    ctx.beginPath()
    ctx.moveTo(-2, -5)
    ctx.quadraticCurveTo(-4, -6, -6, -4)
    ctx.quadraticCurveTo(-7, -2, -5, 1)
    ctx.quadraticCurveTo(-3, 4, 0, 5)
    ctx.quadraticCurveTo(5, 5, 5, -1)
    ctx.quadraticCurveTo(6, -5, 3, -5)
    ctx.quadraticCurveTo(1, -5, 0, -2)
    ctx.quadraticCurveTo(-2, 3, -5, 5)
    ctx.moveTo(1, 1)
    ctx.quadraticCurveTo(3, 4, 4, 6)
    ctx.stroke()

    // salt
    const spots = [
        -5, -6,
        1, -6,
        4, -4,
        -5, 0,
        -2, 0,
        6, 1,
        -4, 6,
        5, 5,
    ]

    ctx.fillStyle = '#fff'
    for (let i = 0, len = spots.length; i < len; ++i) {
        ctx.beginPath()
        ctx.arc(spots[i], spots[++i], 0.65, 0, 2 * Math.PI)
        ctx.fill()
    }

    ctx.restore()
}

function drawPearSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // body
    ctx.fillStyle = ctx.strokeStyle = '#0f0'

    ctx.beginPath()
    ctx.moveTo(0, -4)
    ctx.bezierCurveTo(-1, -4, -2, -3, -2, -1)
    ctx.bezierCurveTo(-2, 1, -4, 2, -4, 4)
    ctx.bezierCurveTo(-4, 6, -2, 7, 0, 7)
    ctx.bezierCurveTo(2, 7, 4, 6, 4, 4)
    ctx.bezierCurveTo(4, 2, 2, 1, 2, -1)
    ctx.bezierCurveTo(2, -3, 1, -4, 0, -4)
    ctx.stroke()
    ctx.fill()

    // blue shine
    ctx.strokeStyle = '#03f'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-2, 3)
    ctx.quadraticCurveTo(-2, 5, -1, 5)
    ctx.stroke()

    // white stem
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(0, -4)
    ctx.quadraticCurveTo(0, -6, 2, -6)
    ctx.stroke()

    ctx.restore()
}

function drawBananaSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // body
    ctx.fillStyle = ctx.strokeStyle = '#ff0'

    ctx.beginPath()
    ctx.moveTo(-5, 5)
    ctx.quadraticCurveTo(-4, 5, -2, 6)
    ctx.bezierCurveTo(2, 6, 6, 2, 6, -4)
    ctx.lineTo(3, -3)
    ctx.lineTo(3, -2)
    ctx.lineTo(-4, 5)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()

    // stem
    ctx.strokeStyle = '#ff0'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(4, -5)
    ctx.lineTo(5, -6)
    ctx.stroke()

    // black mark
    ctx.strokeStyle = '#000'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(3, -1)
    ctx.lineTo(-2, 4)
    ctx.stroke()

    // shine
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(2, 3)
    ctx.lineTo(0, 5)
    ctx.stroke()

    ctx.restore()
}

function drawCookieSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // body
    ctx.fillStyle = '#f9bd6d'

    ctx.beginPath()
    ctx.arc(0, 0, 6, 0, Math.PI * 2)
    ctx.fill()

    // chocolate chips
    var spots = [
        0, -3,
        -4, -1,
        0, 2,
        3, 0,
        3, 3,
    ]

    ctx.fillStyle = '#000'
    for (let i = 0, len = spots.length; i < len; ++i) {
        ctx.beginPath()
        ctx.arc(spots[i], spots[++i], 0.75, 0, 2 * Math.PI)
        ctx.fill()
    }

    ctx.restore()
}

function drawCookieSpriteFlash(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    // body
    ctx.fillStyle = '#000'
    ctx.strokeStyle = '#f9bd6d'
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.arc(0, 0, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // chocolate chips
    const spots = [
        0, -3,
        -4, -1,
        0, 2,
        3, 0,
        3, 3,
    ]

    ctx.fillStyle = '#f9bd6d'
    for (let i = 0, len = spots.length; i < len; ++i) {
        ctx.beginPath()
        ctx.arc(spots[i], spots[++i], 0.75, 0, 2 * Math.PI)
        ctx.fill()
    }

    ctx.restore()
}

const fruitSprites = {
    'cherry': drawCherrySrite,
    'strawberry': drawStrawberrySprite,
    'orange': drawOrangeSprite,
    'apple': drawAppleSprite,
    'melon': drawMelonSprite,
    'galaxian': drawGalaxianSprite,
    'bell': drawBellSprite,
    'key': drawKeySprite,
    'pretzel': drawPretzelSprite,
    'pear': drawPearSprite,
    'banana': drawBananaSprite,
    'cookie': drawCookieSprite,
}

function drawRecordSymbol(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)

    ctx.fillStyle = color

    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
}

function drawRewindSymbol(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)

    ctx.fillStyle = color

    const s = 3
    function drawTriangle(x) {
        ctx.beginPath()
        ctx.moveTo(x, s)
        ctx.lineTo(x - 2 * s, 0)
        ctx.lineTo(x, -s)
        ctx.closePath()
        ctx.fill()
    }

    drawTriangle(0)
    drawTriangle(2 * s)

    ctx.restore()
}

function drawUpSymbol(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)

    const s = tileSize
    ctx.fillStyle = color

    ctx.beginPath()
    ctx.moveTo(0, -s / 2)
    ctx.lineTo(s / 2, s / 2)
    ctx.lineTo(-s / 2, s / 2)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}

function drawDownSymbol(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)

    const s = tileSize
    ctx.fillStyle = color

    ctx.beginPath()
    ctx.moveTo(0, s / 2)
    ctx.lineTo(s / 2, -s / 2)
    ctx.lineTo(-s / 2, -s / 2)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}

function drawSnailSprite(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)

    ctx.lineWidth = 1.0
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.fillStyle = ctx.strokeStyle = color

    ctx.beginPath()
    ctx.moveTo(-7, 3)
    ctx.lineTo(-5, 3)
    ctx.bezierCurveTo(-6, 0, -5, -3, -2, -3)
    ctx.bezierCurveTo(0, -3, 2, -2, 2, 2)
    ctx.bezierCurveTo(3, -1, 3, -2, 5, -2)
    ctx.bezierCurveTo(6, -2, 6, 0, 5, 0)
    ctx.bezierCurveTo(4, 1, 4, 3, 2, 3)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(4, -2)
    ctx.lineTo(3, -5)
    ctx.moveTo(5, -1)
    ctx.lineTo(7, -5)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(3, -5, 1, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(7, -5, 1, 0, Math.PI * 2)
    ctx.fill()

    ctx.lineWidth = 0.5
    ctx.strokeStyle = '#000'

    ctx.beginPath()
    ctx.moveTo(-4, 1)
    ctx.bezierCurveTo(-5, -1, -3, -3, -1, -2)
    ctx.bezierCurveTo(0, -1, 0, 0, -1, 1)
    ctx.bezierCurveTo(-2, 1, -3, 0, -2, -0.5)
    ctx.stroke()

    ctx.restore()
}

function drawHeartSprite(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    ctx.fillStyle = '#ffb8ff'

    ctx.beginPath()
    ctx.moveTo(0, -3)
    ctx.bezierCurveTo(-1, -4, -2, -6, -3.5, -6)
    ctx.quadraticCurveTo(-7, -6, -7, -0.5)
    ctx.bezierCurveTo(-7, 2, -2, 5, 0, 7)
    ctx.bezierCurveTo(2, 5, 7, 2, 7, -0.5)
    ctx.quadraticCurveTo(7, -6, 3.5, -6)
    ctx.bezierCurveTo(2, -6, 1, -4, 0, -3)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}

function drawExclamationPoint(ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)

    ctx.lineWidth = 0.5
    ctx.strokeStyle = ctx.fillStyle = '#ff0'

    ctx.beginPath()
    ctx.moveTo(-1, 1)
    ctx.bezierCurveTo(-1, 0, -1, -3, 0, -3)
    ctx.lineTo(2, -3)
    ctx.bezierCurveTo(2, -2, 0, 0, -1, 1)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(-2, 3, 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
}
