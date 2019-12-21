import { chooseAction as qAction, constructQ } from './qlearning.js'
import { chooseAction as policyAction } from './policy.js'
import { chooseAction as extendedPolicyAction } from './extendedpolicy.js'
import * as direction from '../direction.js'

export const QAgent = {
    chooseAction: function(game) { return qAction(this.Q, game).action },
    Q: {}
}

export const QHumanAgent = {
    chooseAction: function(game) { return qAction(this.Q, game).action },
    Q: constructQ()
}

export const PolicyAgent = {
    chooseAction: function(game) {
        // if (game.frame % 4 != 0) return direction.stop

        const entry = policyAction(this.model, game, 0.01)
        entry.state.dispose()

        return entry.action
    },
    model: null
}

export const ExtendedPolicyAgent = {
    chooseAction: function(game) {
        if (game.frame % 4 != 0) return direction.stop

        if (!game.tfjs) game.tfjs = { frames: [] }

        const entry = extendedPolicyAction(this.model, game, 0.1, game.tfjs.frames, 4)
        entry.state.dispose()

        return entry.action
    },
    model: null
}
