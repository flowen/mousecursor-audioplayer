import './index.scss'
import VMath from './utils/vmath'
import Canvas from './utils/canvas'
// import { TweenLite } from './utils/Tweenlite.min'

const c = document.querySelector('#canvas')
const canvas = new Canvas(c)
canvas.init()

const draw = () => {
  t += tDelta
  clearCanvas()

  canvas.ctx.save()
  canvas.ctx.translate(this.pos.x, this.pos.y)
  canvas.ctx.beginPath()
  canvas.ctx.fillStyle = `rgba(114, 127, 187, ${this.opacity})`
  canvas.ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
  canvas.ctx.fill()
  canvas.ctx.restore()

  window.requestAnimationFrame(draw)
}

canvas.draw(draw)

requestAnimationFrame(this.draw.bind(this))
