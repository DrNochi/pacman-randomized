import Menu from './menu.js'
import Game from './game.js'
import { gamePacMan, gameMsPacMan, gameCookieMan } from './gamemodes.js'
import { QAgent, QHumanAgent, PolicyAgent, ExtendedPolicyAgent } from './ai/agents.js'
import debug from './debug.js'

import tfjs from './tfjs.js'
const tf = tfjs.tf

export class FadeNextState {

    frame = 0

    constructor(prev, next, duration, updatePrev, updateNext) {
        this.prev = prev
        this.next = next
        this.duration = duration
        this.updatePrev = updatePrev
        this.updateNext = updateNext

        this.midFrame = Math.floor(duration / 2)
    }

    init() {}

    shutdown(executive) {
        if (this.frame < this.midFrame)
            this.prev.shutdown(executive)
        else if (this.frame > this.midFrame)
            this.next.shutdown(executive)
    }

    update(executive) {
        if (this.frame < this.midFrame) {
            if (this.updatePrev) this.prev.update(executive)
        } else if (this.frame == this.midFrame) {
            this.prev.shutdown(executive)
            this.next.init(executive)
        } else if (this.frame < this.duration) {
            if (this.updateNext) this.next.update(executive)
        } else {
            executive.state = this.next
        }

        ++this.frame
    }

    draw(renderer, executive) {
        let t = this.frame / this.duration * 2

        if (this.frame < this.midFrame) {
            this.prev.draw(renderer, executive)
            renderer.overlay = `rgba(0,0,0,${t})`
        } else if (this.frame == this.midFrame) {
            renderer.overlay = '#000'
        } else if (this.frame > this.midFrame) {
            this.next.draw(renderer, executive)
            renderer.overlay = `rgba(0,0,0,${2 - t})`
        }
    }

}

const homeMenu = new Menu('CHOOSE A GAME')
homeMenu.addTextButton(gamePacMan.name, exec => {
    exec.switchState(newGameState)
    exec.data.game = new Game(gamePacMan, exec.data.mapgen, exec.data.playerAi)
})
homeMenu.addTextButton(gameMsPacMan.name, exec => {
    exec.switchState(newGameState)
    exec.data.game = new Game(gameMsPacMan, exec.data.mapgen, exec.data.playerAi)
})
homeMenu.addTextButton(gameCookieMan.name, exec => {
    exec.switchState(newGameState)
    exec.data.game = new Game(gameCookieMan, exec.data.mapgen, exec.data.playerAi)
})
homeMenu.addSpacer(0.5)
homeMenu.addTextButton('LEARN', exec => console.log('todo'))
homeMenu.addSpacer(0.5)
homeMenu.addTextButton('AI SETTINGS', exec => exec.switchState(aiSettingsState))

homeMenu.buttons[1].disabled = true
homeMenu.buttons[2].disabled = true
homeMenu.buttons[3].disabled = true

export const homeState = {
    init: function (executive) {
        executive.frontend.registerMenu(homeMenu, executive)
    },

    shutdown: function (executive) {
        executive.frontend.unregisterMenu(homeMenu)
    },

    update: function() {},

    draw: function(renderer) {
        renderer.drawMenu(homeMenu)
    }
}

const aiMenu = new Menu('AI SETTINGS')
aiMenu.addTextButton('', exec => {
    exec.data.playerAi = exec.data.playerAi == QAgent ? undefined : QAgent
    resetAiMenu(exec)
})
aiMenu.addTextButton('', exec => {
    exec.data.playerAi = exec.data.playerAi == QHumanAgent ? undefined : QHumanAgent
    resetAiMenu(exec)
})
aiMenu.addTextButton('', exec => {
    exec.data.playerAi = exec.data.playerAi == PolicyAgent ? undefined : PolicyAgent
    resetAiMenu(exec)
})
aiMenu.addTextButton('', exec => {
    exec.data.playerAi = exec.data.playerAi == ExtendedPolicyAgent ? undefined : ExtendedPolicyAgent
    if (exec.data.playerAi) alert('This bot did not enjoy a long training session! It probably has poor playing strength')
    resetAiMenu(exec)
})
aiMenu.addTextButton('', exec => {
    exec.data.mapgen = !exec.data.mapgen
    resetAiMenu(exec)
})
aiMenu.addTextButton('', exec => {
    debug.enabled = !debug.enabled
    resetAiMenu(exec)
})
aiMenu.addSpacer(0.5)
aiMenu.addTextButton('BACK', exec => exec.switchState(homeState))
aiMenu.backButton = aiMenu.buttons[aiMenu.buttons.length - 1]

function resetAiMenu(exec) {
    aiMenu.buttons[0].text = exec.data.playerAi == QAgent ? '* Q LEARNING *' : 'Q LEARNING'
    aiMenu.buttons[1].text = exec.data.playerAi == QHumanAgent ? '* Q LEARNING (HUMAN) *' : 'Q LEARNING (HUMAN)'
    aiMenu.buttons[2].text = exec.data.playerAi == PolicyAgent ? '* POLICY NETWORK *' : 'POLICY NETWORK'
    aiMenu.buttons[3].text = exec.data.playerAi == ExtendedPolicyAgent ? '*POLICY NETWORK (EX)*' : 'POLICY NETWORK (EX)'
    aiMenu.buttons[4].text = exec.data.mapgen ? '* RANDOM MAPS *' : 'RANDOM MAPS'
    aiMenu.buttons[5].text = debug.enabled ? '* TOGGLE DEBUG *' : 'TOGGLE DEBUG'
}

const aiSettingsState = {
    init: function (executive) {
        resetAiMenu(executive)
        executive.frontend.registerMenu(aiMenu, executive)
    },

    shutdown: function (executive) {
        executive.frontend.unregisterMenu(aiMenu)
    },

    update: function() {},

    draw: function(renderer) {
        renderer.drawMenu(aiMenu)
    }
}

const newGameMenu = new Menu()
newGameMenu.addSpacer(2)
newGameMenu.addTextButton('PLAY', exec => exec.switchState(initGameState, 60))
newGameMenu.addTextButton('PLAY TURBO', exec => {
    exec.data.game.turboMode = true
    exec.switchState(initGameState, 60)
})
newGameMenu.addTextButton('PRACTICE', exec => {
    exec.data.game.practiceMode = true
    exec.switchState(initGameState, 60)
})
newGameMenu.addTextButton('CUTSCENES', exec => console.log('todo'))
newGameMenu.addTextButton('ABOUT', exec => console.log('todo'))
newGameMenu.addSpacer(0.5)
newGameMenu.addTextButton('BACK', exec => exec.switchState(homeState))
newGameMenu.backButton = newGameMenu.buttons[newGameMenu.buttons.length - 1]

newGameMenu.buttons[3].disabled = true
newGameMenu.buttons[4].disabled = true

const newGameState = {
    init: function (executive) {
        executive.frontend.registerMenu(newGameMenu, executive)
    },

    shutdown: function (executive) {
        executive.frontend.unregisterMenu(newGameMenu)
    },

    update: function() {},

    draw: function(renderer) {
        renderer.drawMenu(newGameMenu)
    }
}

const initGameState = {
    duration: 2,

    init: function(executive) {
        executive.data.frames = 0
        console.log('todo')
    },

    shutdown: function() {},

    update: function(executive) {
        if (executive.data.frames == 60 * this.duration)
            executive.switchState(initLevelState)
        else
            ++executive.data.frames
    },

    draw: function(renderer, executive) {
        renderer.drawGame(executive.data.game)
    }
}

const initLevelState = {
    duration: 2,

    init: function(executive) {
        executive.data.frames = 0
        console.log('todo')
    },

    shutdown: function() {},

    update: function(executive) {
        if (executive.data.frames == 60 * this.duration)
            executive.switchState(playState)
        else
            ++executive.data.frames
    },

    draw: function(renderer, executive) {
        renderer.drawGame(executive.data.game)
    }
}

const playState = {
    init: function(executive) {
        console.log('todo')
        executive.frontend.registerPlayerControls(executive.data.game.player)
    },

    shutdown: function(executive) {
        executive.frontend.unregisterPlayerControls(executive.data.game.player)

        if (executive.data.game.tfjs) tf.dispose(tfjs)
    },

    update: function(executive) {
        executive.data.game.update(executive)
    },

    draw: function(renderer, executive) {
        renderer.drawGame(executive.data.game)
    }
}
