import { chooseAction, constructQ } from './qlearning.js';

export const QAgent = {
    chooseAction: function(game) { return chooseAction(this.Q, game).action },
    Q: {}
}

export const QHumanAgent = {
    chooseAction: function(game) { return chooseAction(this.Q, game).action },
    Q: constructQ()
}
