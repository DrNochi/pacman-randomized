import * as agents from '../ai/agents.js'

import tfjs from '../tfjs.js'
const tf = tfjs.tf

const load = () => {
    fetch('data/q.3220.json')
        .then(response => response.json())
        .then(data => agents.QAgent.Q = data)

    tf.loadLayersModel('data/policy/model.json')
        .then(model => {
            agents.PolicyAgent.model = model
        })

    tf.loadLayersModel('data/extendedpolicy/model.json')
        .then(model => {
            agents.ExtendedPolicyAgent.model = model
        })
}

load()
