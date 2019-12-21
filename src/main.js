import './config/requestanimationframe.js'
import './config/localstorage.js'
import './config/tfjs-external.js'
import './config/fetchdata.js'

import { CanvasFrontEnd } from './frontend.js'
import { homeState } from './states.js'
import Executive from './executive.js'

const canvas = document.getElementById('canvas')
const frontend = new CanvasFrontEnd(canvas)
const executive = new Executive(frontend)
executive.switchState(homeState)

function resize() {
    const sx = innerWidth / canvas.clientWidth
    const sy = innerHeight / canvas.clientHeight
    const s = Math.min(sx, sy)

    canvas.style.width = Math.floor(canvas.clientWidth * s) + 'px'

    frontend.renderer.scaleCanvas(s)
    executive.render()
}

let resizeTimeout
addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(resize, 100)
}, false)

resize()

executive.start()
