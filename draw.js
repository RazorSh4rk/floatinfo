class DrawJS {
    constructor(canvasID) {
        this.canvID = canvasID
        this.canv = document.getElementById(canvasID)
        this.ctx = this.canv.getContext('2d')
        this.width = this.canv.width
        this.height = this.canv.height
        this.translationX = 0
        this.translationY = 0
        this.translated = false
        this.logTranslate = true
    }
    getCanvas(){
        return this.canv
    }
    getContext(){
        return this.ctx
    }
    resize(x, y) {
        this.width = x
        this.canv.width = x
        this.height = y
        this.canv.height = y
    }
    fullscreen() {
        let x = document.createElement('STYLE'),
            t = document.createTextNode(
                '* { margin: 0; padding: 0;}' +
                'body, html { height:100%; }' +
                '#' + this.canvID + '{position:absolute; width:100%; height:100%; }'
            );
        x.appendChild(t)
        document.head.appendChild(x)
        this.resize(window.innerWidth, window.innerHeight)
    }
    background(color) {
        if (this.translated) {
            this.ctx.fillStyle = color
            this.ctx.fillRect(
                this.translationX - (2 * this.width),
                this.translationY - (2 * this.height),
                2 * this.width, 2 * this.height
            )
        } else {
            this.ctx.fillStyle = color
            this.ctx.fillRect(0, 0, this.width, this.height)
        }
    }
    arc(x, y, r, start, end, anticlock, color, fill) {
        if (fill) {
            this.ctx.fillStyle = color
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, start, end, anticlock)
            this.ctx.fill()
        } else {
            this.ctx.strokeStyle = color
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, start, end, anticlock)
            this.ctx.stroke()
        }
    }
    circle(x, y, r, color, fill) {
        if (fill) {
            this.arc(x, y, r, 0, 2 * Math.PI, false, color, true)
        } else {
            this.arc(x, y, r, 0, 2 * Math.PI, false, color, false)
        }
    }
    point(x, y, color) {
        this.circle(x, y, 3, color, true)
    }
    pixel(x, y, color) {
        this.circle(x, y, 1, color, true)
    }
    rect(x, y, w, h, color, fill) {
        if (fill) {
            this.ctx.fillStyle = color
            this.ctx.fillRect(x, y, w, h)
        } else {
            this.ctx.strokeStyle = color
            this.ctx.strokeRect(x, y, w, h)
        }
    }
    polygon(vertices, color, fill) {
        if (fill) {
            this.ctx.fillStyle = color
            this.ctx.beginPath()
            vertices.forEach(e => {
                this.ctx.lineTo(e.x, e.y)
            })
            this.ctx.closePath()
            this.ctx.fill()
        } else {
            this.ctx.strokeStyle = color
            this.ctx.beginPath()
            vertices.forEach(e => {
                this.ctx.lineTo(e.x, e.y)
                this.ctx.moveTo(e.x, e.y)
            })
            this.ctx.stroke()
        }
    }
    line(vertex0, vertex1, color) {
        this.ctx.strokeStyle = color
        this.ctx.moveTo(vertex0.x, vertex0.y)
        this.ctx.lineTo(vertex1.x, vertex1.y)
        this.ctx.stroke()
    }
    rotate(degrees) {
        this.ctx.rotate(degrees * Math.PI / 180)
    }
    flipX() {
        this.ctx.scale(-1, 1)
    }
    flipY() {
        this.ctx.scale(1, -1)
    }
    translate(x, y) {
        if (this.logTranslate)
            console.log('This function is not yet fully supported' +
                ' due to bugs with the background function. Use at your own risk.');
        if (x == 0 && y == 0)
            this.translated = false
        this.translationX = x
        this.translationY = y
        this.translated = true
        this.ctx.translate(x, y)
    }
    center() {
        this.logTranslate = false
        this.translationX = this.canv.width / 2
        this.translationY = this.canv.height / 2
        this.translate(this.canv.width / 2, this.canv.height / 2)
        this.logTranslate = true
    }
    resetTranslation() {
        this.translated = false
        this.translate(-this.transLationX, -this.translationY)
    }
    write(text, x, y, color, fill, font) {
        this.ctx.font = font
        if (fill) {
            this.ctx.fillStyle = color
            this.ctx.fillText(text, x, y)
        } else {
            this.ctx.strokeStyle = color
            this.ctx.strokeText(text, x, y)
        }
    }
    image(path, x, y, width, height) {
        let img = new Image(),
            sup = this
        img.src = path
        img.onload = function () {
            if (width !== undefined && height !== undefined) {
                sup.ctx.drawImage(img, x, y, width, height)
            }
            else {
                sup.ctx.drawImage(img, x, y)
            }
        }
    }
    imageCrop(path, x, y, width, height, cropX, cropY, cropWidth, cropHeight){
        let img = new Image(),
            sup = this
        img.src = path
        img.onload = function(){
            sup.ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, x, y, width, height)
        }
    }
}

class Vertex {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class TileMap{
    constructor(path, tileWidth, tileHeight){
        this.tileWidth = tileWidth
        this.tileHeight = tileHeight
        this.path = path

        this.img = new Image()
        this.img.src = path
        this.mapWidth = 0
        this.mapHeight = 0

        let sup = this
        this.img.onload = function(){
            sup.mapWidth = sup.img.width
            sup.mapHeight = sup.img.height
        }
    }
    drawTile(d, x, y, i, j){
        // TODO: document me plz
        let offsetX = i * this.tileWidth,
            offsetY = j * this.tileHeight
        d.imageCrop(this.path, x, y, this.tileWidth, this.tileHeight, offsetX, offsetY, this.tileWidth, this.tileHeight)
    }
}