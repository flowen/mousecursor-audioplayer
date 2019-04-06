import VMath from './utils/vmath'
import Player from './utils/audioplayer'

const player = new Player()

export default class Cursor {
  constructor(w, h) {
    this.opacity = 0
    this.ease = 0.05
    this.pos = {
      x: w / 2,
      y: h / 2,
    }
    this.vel = {
      x: w / 2,
      y: h / 2,
    }
    this.acc = 2
    this.delta = 0.01
    this.radius = 50
    this.force = 2
    this.distance = false
  }

  get _getPos() {
    return this.pos
  }

  get _getOpacity() {
    return this.opacity
  }

  fadeIn() {
    this.opacity < 1 ? (this.opacity += this.delta) : (this.opacity = 1)
  }

  fadeOut() {
    this.opacity > 0 ? (this.opacity -= this.delta * 2) : (this.opacity = 0)
  }

  get isMouseOver() {
    // prettier-ignore
    if (Math.abs(this.distance.x) < this.radius && 
        Math.abs(this.distance.y) < this.radius) {
      return true
    } else {
      return false
    }
  }

  follow(mouseCoords) {
    this.distance = VMath.distance(mouseCoords, this.pos)
    const offset = 10

    if (Math.abs(this.distance.x) > offset) {
      this.pos.x += (mouseCoords.x - this.pos.x) * this.ease
    }

    if (Math.abs(this.distance.y) > offset) {
      this.pos.y += (mouseCoords.y - this.pos.y) * this.ease
    }
  }

  playVoice() {
    player.play()
  }

  draw(ctx, mouseOver) {
    !mouseOver ? this.fadeOut() : this.fadeIn()

    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()

    // mousecursor
    ctx.fillStyle = `rgba(114, 127, 187, ${this.opacity})`
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    // timer
    if (player.currentProgress) {
      const degrees = player.currentProgress * (360 / 100)

      ctx.strokeStyle = `rgb(255,255,255, ${this.opacity})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, this.radius, 0, (degrees * Math.PI) / 180, true)
      ctx.stroke()
      ctx.closePath()
    }

    // label
    ctx.font = '22px Work Sans'
    ctx.textAlign = 'center'
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`

    if (player.state === 'suspended' || !player.state) {
      ctx.fillText('Play', 0, 8)
    } else if (player.state === 'running') {
      ctx.fillText('Pause', 0, 8)
    } else if (player.state === 'closed') {
      ctx.fillText('Play', 0, -8)
      ctx.fillText('again', 0, 18)
      ctx.lineWidth = 2
    }

    ctx.restore()
  }
}
