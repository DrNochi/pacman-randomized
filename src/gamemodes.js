import Map from './map.js'
import highscores from './highscores.js'
import { pacmanMap } from './maps.js'

export const gamePacMan = {
    name: 'PAC-MAN',

    description: [
        'ORIGINAL ARCADE:',
        '  NAMCO (C) 1980',
        '',
        'REVERSE-ENGINEERING:',
        '  JAMEY PITTMAN',
        '',
        'ORIGINAL REMAKE:',
        '  SHAUN WILLIAMS',
    ],

    ghostNames: ['BLINKY', 'PINKY', 'INKY', 'CLYDE'],

    highscore: 10000,
    highscoreTurbo: 10000,

    getMap: level => Object.assign(Object.create(Map.prototype), JSON.parse(JSON.stringify(pacmanMap)))
}

export const gameMsPacMan = {
    name: 'MS PAC-MAN',

    description: [
        'ORIGINAL ARCADE ADDON:',
        '  MIDWAY/GCC (C) 1981',
        '',
        'REVERSE-ENGINEERING:',
        '  BART GRANTHAM',
        '',
        'REMAKE:',
        '  SHAUN WILLIAMS',
    ],

    ghostNames: ['BLINKY', 'PINKY', 'INKY', 'SUE'],

    highscore: 10000,
    highscoreTurbo: 10000,
}

export const gameCrazyOtto = {
    name: 'CRAZY OTTO',

    description: [
        'THE UNRELEASED',
        'MS. PAC-MAN PROTOTYPE:',
        '  GCC (C) 1981',
        '',
        'SPRITES REFERENCED FROM:',
        '  STEVE GOLSON\'S',
        '  CAX 2012 PRESENTATION',
        '',
        'REMAKE:',
        '  SHAUN WILLIAMS',
    ],

    ghostNames: ['PLATO', 'DARWIN', 'FREUD', 'NEWTON'],

    highscore: 10000,
    highscoreTurbo: 10000
}

export const gameCookieMan = {
    name: 'COOKIE-MAN',

    description: [
        'A NEW PAC-MAN GAME',
        'WITH RANDOM MAZES:',
        '  SHAUN WILLIAMS (C) 2012',
        '',
        'COOKIE MONSTER DESIGN:',
        '  JIM HENSON',
        '',
        'PAC-MAN CROSSOVER CONCEPT:',
        '  TANG YONGFA',
    ],

    ghostNames: ['ELMO', 'PIGGY', 'ROSITA', 'ZOE'],

    highscore: 10000,
    highscoreTurbo: 10000
}

const gameModes = [
    gamePacMan,
    gameMsPacMan,
    gameCrazyOtto,
    gameCookieMan
]

function loadHighscores() {
    for (const mode of gameModes) {
        mode.highscore = highscores.load(`${mode.name}_highscore`) || mode.highscore
        mode.highscoreTurbo = highscores.load(`${mode.name}_highscoreTurbo`) || mode.highscoreTurbo
    }
}

loadHighscores()
