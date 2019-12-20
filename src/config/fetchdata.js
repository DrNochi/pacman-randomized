import * as agents from '../ai/agents.js'

(async () => {
    const response = await fetch('data/q.3220.json')
    const data = await response.json()
    agents.QAgent.Q = data
})()
