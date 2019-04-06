import './index.scss'
// import VMath from './utils/vmath'
import Cursor from './cursor.js'
import { getMousePos } from './utils/getMousePos'
import VMath from './utils/vmath'

// show loader (border around circle)

const c = document.querySelector('#canvas')
const ctx = c.getContext('2d')
const windowWidth = window.innerWidth
// const windowHeight = window.innerHeight

const aspectRatio = 1
const w = windowWidth * 0.66
const h = w * aspectRatio

const setCanvasDimensions = () => {
  c.width = w
  c.height = h
}

// global variables
let mouseOver = false
let t = 0

// get coordinates
let mouseCoords = { x: 0, y: 0 }

const cursor = new Cursor(w, h)

const moveCanvas = (e) => {
  mouseCoords = getMousePos(e, c)
}

const enterCanvas = (e) => {
  mouseOver = true
}
const leaveCanvas = (e) => {
  mouseOver = false
}

const clearCanvas = () => {
  // Store the current transformation matrix
  ctx.save()

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, c.width, c.height)

  // Restore the transform
  ctx.restore()
}

const playVoice = () => (cursor.isMouseOver ? cursor.playVoice() : '')

const init = () => {
  setCanvasDimensions()
  window.addEventListener('resize', setCanvasDimensions)
  c.addEventListener('mouseenter', enterCanvas)
  c.addEventListener('mousemove', moveCanvas)
  c.addEventListener('mouseleave', leaveCanvas)
  c.addEventListener('click', playVoice)

  // smoothhack
  ctx.translate(0.5, 0.5)

  window.requestAnimationFrame(draw)
}

const draw = () => {
  clearCanvas()

  if (mouseOver) {
    cursor.fadeIn()
  } else if (cursor._getOpacity > 0) {
    cursor.fadeOut()
  }

  cursor.follow(mouseCoords)
  cursor.draw(ctx, mouseOver)

  requestAnimationFrame(draw)
}

init()
