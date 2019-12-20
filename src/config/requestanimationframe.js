import timer from '../timer.js'
timer.requestAnimationFrame = cb => requestAnimationFrame(cb)
timer.cancelAnimationFrame = id => cancelAnimationFrame(id)
