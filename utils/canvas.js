export default class Canvas {
  constructor(el) {
    this.el = el
    this.ctx = el.getContext('2d')
    this.aspectRatio = 1
    this.width = null
    this.height = null
    this.mouseOver = false
    this.t = 0
    this.tDelta = 0.1
    this.mouseCoords = { x: 0, y: 0 }
  }

  setCanvasDimensions() {
    const w = window.innerWidth * 0.66
    this.el.width = w
    this.el.height = w * this.aspectRatio
  }

  getMousePos(e) {
    if (e.targetTouches && e.targetTouches[0]) {
      e = e.targetTouches[0]
    }
    const rect = this.el.getBoundingClientRect()

    this.mouseCoords = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  clearCanvas() {
    // Store the current transformation matrix
    this.ctx.save()

    // Use the identity matrix while clearing the canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.width, this.height)

    // Restore the transform
    this.ctx.restore()
  }

  _mouseOver(bln) {
    this.mouseOver = bln
  }

  draw(cb) {
    console.log(cb)
    // if(!cb) return
    this.clearCanvas()
    cb()
    requestAnimationFrame(this.draw.bind(this, cb))
  }

  init() {
    this.setCanvasDimensions()
    window.addEventListener('resize', this.setCanvasDimensions.bind(this))
    this.el.addEventListener('mousemove', (e) => this.getMousePos.apply(this, [e]))
    this.el.addEventListener('mouseenter', () => this._mouseOver.bind(this, true))
    this.el.addEventListener('mouseleave', () => this._mouseOver.bind(this, false))

    // smoothhack
    this.ctx.translate(0.5, 0.5)
  }
}
