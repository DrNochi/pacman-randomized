let lastTime = 0
const refreshRate = 1000 / 60

export default {
    setImmediate: cb => setImmediate(cb),
    clearImmediate: id => clearImmediate(id),

    setTimeout: (cb, t) => setTimeout(cb, t),
    clearTimeout: id => clearTimeout(id),

    requestAnimationFrame: function (cb) {
        const currTime = new Date().getTime()
        const timeToCall = Math.max(0, refreshRate - (currTime - lastTime))
        return this.setTimeout(() => {
            lastTime = currTime + timeToCall
            cb(currTime + timeToCall)
        }, timeToCall)
    },

    cancelAnimationFrame: function (id) {
        this.clearTimeout(id)
    }
}
