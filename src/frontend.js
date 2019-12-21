import { Canvas2DRenderer } from './renderer.js'
import * as direction from './direction.js'

export class CanvasFrontEnd {

    constructor(canvas) {
        this.canvas = canvas
        this.renderer = new Canvas2DRenderer(canvas)
    }

    register(executive) {
        function focus() {
            executive.start()
        }

        function blur() {
            executive.stop()
        }

        this.events = {
            'focus': focus,
            'blur': blur
        }

        for (const event in this.events)
            addEventListener(event, this.events[event])
    }

    unregister() {
        for (const event in this.events)
            removeEventListener(event, this.events[event])
    }

    registerMenu(menu, executive) {
        for (const button of menu.buttons)
            this.registerButton(button, executive)
    }

    unregisterMenu(menu) {
        for (const button of menu.buttons)
            this.unregisterButton(button)
    }

    registerButton(button, executive) {
        if (button.disabled) return

        const that = this

        let selected = false
        function down(event) {
            if (button.contains(that.renderer.clientToContextCoords(event.offsetX, event.offsetY))) {
                button.focused = true
                selected = true
            }
        }

        function up(event) {
            if (selected) {
                if (button.contains(that.renderer.clientToContextCoords(event.offsetX, event.offsetY)))
                    button.onclick(executive)
            }

            selected = false
        }

        function move(event) {
            button.focused = button.contains(that.renderer.clientToContextCoords(event.offsetX, event.offsetY))
        }

        function leave(event) {
            button.focused = false
        }

        function cancel(event) {
            selected = false
        }

        button.events = {
            'pointerdown': down,
            'pointerup': up,
            'pointermove': move,
            'pointerleave': leave,
            'pointercancel': cancel
        }

        for (const event in button.events)
            this.canvas.addEventListener(event, button.events[event])
    }

    unregisterButton(button) {
        for (const event in button.events)
            this.canvas.removeEventListener(event, button.events[event])
        button.focused = false
    }

    registerPlayerControls(player) {
        function directionFromKey(key) {
            switch (key) {
                case 'w':
                case 'ArrowUp':
                    return direction.up

                case 'a':
                case 'ArrowLeft':
                    return direction.left

                case 's':
                case 'ArrowDown':
                    return direction.down

                case 'd':
                case 'ArrowRight':
                    return direction.right
            }
        }

        function down(event) {
            const dir = directionFromKey(event.key)
            player.inputDir = dir != undefined ? dir : player.inputDir
        }

        function up(event) {
            if (player.inputDir == directionFromKey(event.key))
                player.inputDir = direction.stop
        }

        const threshold = 2
        let swiping, swipeX, swipeY, swiped

        function swipeStart(event) {
            swipeX = event.pageX
            swipeY = event.pageY
            swiping = true
            swiped = false
        }

        function swipeMove(event) {
            if (swiping) {
                const dx = event.pageX - swipeX
                const dy = event.pageY - swipeY

                if (dx * dx + dy * dy > threshold * threshold) {
                    swipeX = event.pageX
                    swipeY = event.pageY
                    swiped = true

                    if (Math.abs(dx) > Math.abs(dy))
                        player.inputDir = dx < 0 ? direction.left : direction.right
                    else
                        player.inputDir = dy < 0 ? direction.up : direction.down
                }
            }
        }

        function swipeEnd(event) {
            if (!swiped) player.inputDir = direction.stop
            swiping = false
        }

        function swipeCancel(event) {
            player.inputDir = direction.stop
            swiping = false
        }

        player.events = {
            'keydown': down,
            'keyup': up,
            'pointerdown': swipeStart,
            'pointerup': swipeEnd,
            'pointermove': swipeMove,
            'pointercancel': swipeCancel
        }

        for (const event in player.events)
            addEventListener(event, player.events[event])
    }

    unregisterPlayerControls(player) {
        for (const event in player.events)
            removeEventListener(event, player.events[event])
    }

}
