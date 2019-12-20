import timer from './timer.js'
import { FadeNextState } from './states.js'
import debug from './debug.js'

const framePeriod = 1000 / 60

export class Executive {

    paused = false
    running = false

    data = {}
    state = {
        init: () => {},
        shutdown: () => {},
        update: () => {},
        draw: () => {}
    }

    reqFrame = 0
    gameTime = 0

    realtime = true

    constructor(frontend, renderer) {
        this.frontend = frontend
        this.renderer = renderer

        frontend.register(this)
    }

    start() {
        if (!this.running) {
            this.running = true
            this.gameTime = 0
            this.nextFrame()
        }
    }

    stop() {
        if (this.running) {
            this.running = false
            if (this.realtime) timer.cancelAnimationFrame(this.reqFrame)
            else timer.clearImmediate(this.reqFrame)
        }
    }

    pause() {
        this.paused = !this.paused
    }

    tick(now) {
        this.gameTime = this.gameTime || now

        if (debug.enabled) {
            this.last = this.last || now
            const duration = now - this.last
            const fps = 1000 / duration
            console.debug(`Frame period: ${duration.toFixed(2)}ms - FPS: ${fps.toFixed(2)}`)
            this.last = now
        }

        if (this.paused) this.gameTime = now

        // skip at max rendering of 3 frames
        this.gameTime = Math.max(this.gameTime, now - 3 * framePeriod)
        while (this.gameTime < now) {
            this.state.update(this)
            this.gameTime += framePeriod
        }

        this.render()

        this.nextFrame()
    }

    render() {
        const renderer = this.renderer || this.frontend.renderer
        if (renderer) {
            renderer.beginFrame()
            this.state.draw(renderer, this)
            renderer.endFrame()
        }
    }

    nextFrame() {
        this.reqFrame = this.realtime
            ? timer.requestAnimationFrame((now) => this.tick(now))
            : timer.setImmediate(() => this.tick(this.gameTime + framePeriod))
    }

    switchState(next, duration, updatePrev, updateNext) {
        this.state.shutdown(this)
        this.state = duration
            ? new FadeNextState(this.state, next, duration, updatePrev, updateNext)
            : next
        this.state.init(this)
    }

}

export default Executive
