import Button from './button.js'
import { tileSize, mapWidth } from './renderer.js'

export class Menu {

    x = 2 * tileSize
    y = 0

    width = mapWidth - 2 * this.x
    height = 3 * tileSize

    padding = tileSize

    buttons = []
    backButton = null

    constructor(title) {
        this.title = title

        this.currentY = title
            ? this.y + this.padding + this.height + this.padding
            : this.y + this.padding
    }

    addButton(button) {
        this.buttons.push(button)
        this.currentY += button.height + this.padding
    }

    addSpacer(size) {
        this.currentY += size * (this.height + this.padding)
    }

    addTextButton(text, onclick) {
        const button = new Button(this.x + this.padding, this.currentY, this.width - 2 * this.padding, this.height, onclick)
        button.text = text
        this.addButton(button)
    }

}

export default Menu
