export class Button {

    focused = false

    text = ''
    icon = null

    constructor(x, y, width, height, onclick) {
        this.x = x
        this.y = y

        this.width = width
        this.height = height

        this.onclick = onclick
    }

    contains(point) {
        return point.x >= this.x
            && point.x <= this.x + this.width
            && point.y >= this.y
            && point.y <= this.y + this.height
    }

}

export default Button
